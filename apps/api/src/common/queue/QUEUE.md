# Queue System

This project uses **BullMQ** backed by **Redis** for background job processing.

- **Development** — bitnami/redis running in Docker (see `docker-compose.yml`)
- **Production** — Upstash Redis (`rediss://` URL with TLS auto-enabled)

---

## How It Works

### Without a queue

```
User action (e.g. Register)
    │
    ▼
AuthService
    ├── save user to DB         ~5ms
    └── send email via SMTP     ~800ms  ← user waits for this
         │
         └── if SMTP is down → request fails, email is lost forever
                                                                    │
                                                                    ▼
HTTP response returned                  ~805ms total
```

### With a queue

```
User action (e.g. Register)
    │
    ▼
AuthService
    ├── save user to DB         ~5ms
    └── queue.add("email job")  ~2ms   ← just writes a record to Redis
         │
         ▼
HTTP response returned          ~7ms total  ← user is done


        (separately, after the response is already sent)

Redis
    │
    ▼
EmailProcessor picks up job
    └── send email via SMTP     ~800ms
          └── if it fails:
                retry 1 after 1s
                retry 2 after 2s   (exponential backoff)
                retry 3 after 4s
                └── if all fail → job stays in Redis as "failed"
                                   (inspectable, retriable manually)
```

### The moving parts

```
┌──────────────────────────────────────────────────────────────┐
│                        NestJS Process                        │
│                                                              │
│   AuthService / AdminService                                 │
│         │  calls                                             │
│         ▼                                                    │
│   MailService.sendVerificationEmail()                        │
│         │  calls queue.add()                                 │
│         ▼                                                    │
│   BullMQ Queue ("email") ──────────────────────────────────────────► Redis
│                                                              │          │
│   EmailProcessor (WorkerHost) ◄────────────────────────────────────── │
│         │  picks up job                                      │    polls for new jobs
│         ▼                                                    │
│   nodemailer → SMTP → email delivered                        │
└──────────────────────────────────────────────────────────────┘
```

| Part             | File                     | Role                                                     |
| ---------------- | ------------------------ | -------------------------------------------------------- |
| `QueueModule`    | `queue.module.ts`        | Global BullMQ config — Redis connection, default retries |
| `MailService`    | `mail/mail.service.ts`   | Enqueues jobs — the only thing business logic touches    |
| `EmailProcessor` | `mail/mail.processor.ts` | Worker — picks up jobs and calls nodemailer              |
| `mail.types.ts`  | `mail/mail.types.ts`     | Queue name constant + typed job payload interfaces       |

---

## Benefits Over Direct/Synchronous Calls

|                           | Before (sync)             | After (queue)                             |
| ------------------------- | ------------------------- | ----------------------------------------- |
| **Response time**         | Waited for SMTP (~800ms)  | Returns immediately (~7ms)                |
| **SMTP downtime**         | Request fails, email lost | Retried automatically up to 3×            |
| **Server crash mid-send** | Email lost                | Job persists in Redis, retried on restart |
| **Failed job visibility** | Silent, gone              | Stored in Redis as `failed`, inspectable  |
| **Slow SMTP**             | Blocks the API            | Happens in background, zero impact        |

---

## Adding a New Queue

Follow these steps every time you introduce a new queue for a different domain.

### 1. Register the queue in its feature module

```typescript
// src/feature/feature.module.ts
import { BullModule } from '@nestjs/bullmq'

@Module({
  imports: [BullModule.registerQueue({ name: 'feature-queue-name' })],
  providers: [FeatureService, FeatureProcessor],
})
export class FeatureModule {}
```

> `QueueModule` is `@Global()` so `BullModule.forRootAsync()` is already configured.
> You only need `registerQueue()` in each feature module — never `forRoot` again.

### 2. Define types

```typescript
// src/feature/feature.types.ts
export const FEATURE_QUEUE = 'feature-queue-name' as const

export const FeatureJobName = {
  DO_SOMETHING: 'do-something',
} as const

export interface DoSomethingData {
  userId: string
  payload: string
}
```

### 3. Create the processor

```typescript
// src/feature/feature.processor.ts
import { Processor, WorkerHost } from '@nestjs/bullmq'
import { Logger } from '@nestjs/common'
import { Job } from 'bullmq'
import { FEATURE_QUEUE, FeatureJobName, DoSomethingData } from './feature.types'

@Processor(FEATURE_QUEUE)
export class FeatureProcessor extends WorkerHost {
  private readonly logger = new Logger(FeatureProcessor.name)

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case FeatureJobName.DO_SOMETHING:
        await this.handleDoSomething(job.data as DoSomethingData)
        break
      default:
        this.logger.warn(`Unknown job: ${job.name}`)
    }
  }

  private async handleDoSomething(data: DoSomethingData) {
    // actual work here
  }
}
```

### 4. Enqueue from your service

```typescript
// src/feature/feature.service.ts
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import { FEATURE_QUEUE, FeatureJobName } from './feature.types'

@Injectable()
export class FeatureService {
  constructor(@InjectQueue(FEATURE_QUEUE) private readonly featureQueue: Queue) {}

  async doSomething(userId: string, payload: string) {
    await this.featureQueue.add(FeatureJobName.DO_SOMETHING, { userId, payload })
  }
}
```

---

## Future Candidates in This Project

These are places in the codebase where a queue would give you the same benefits as email.

---

### Notification Queue — `notification`

**Where to add:** new `notification` module (or extend `announcement`)

**Why:** when an announcement is published (immediately or via the scheduler), every
student in the batch needs to be notified. Today nothing sends a per-user notification.
Doing it synchronously for a batch of 60+ students inside a cron job or HTTP handler
would be slow and fragile.

```typescript
// jobs
NotificationJobName.SEND_ANNOUNCEMENT // { userId, announcementId, title }
NotificationJobName.SEND_ASSIGNMENT // { userId, assignmentId, title, dueDate }
```

**Trigger point:** `AnnouncementService.publishAnnouncement()` and `AssignmentService.create()`

---

### Semester Advancement Queue — `batch`

**Where to add:** `src/batch/`

**Why:** advancing a batch to the next semester touches every student in that batch —
it creates a `StudentSemester` record for each one and updates their status. Today this
is done synchronously (via `EventEmitter2` which is still in-process and in-request).
For a batch with many students this is a single heavy DB transaction blocking the HTTP
response.

```typescript
// jobs
BatchJobName.ADVANCE_SEMESTER // { batchId, fromSemesterId, toSemesterId }
```

**Trigger point:** `BatchService.advanceSemester()` — emit the job instead of doing
the DB work inline.

---

### Assignment Due-Date Queue — `assignment`

**Where to add:** `src/assignment/`

**Why:** when a teacher creates an assignment with a future `dueDate`, today nothing
automatically transitions it to `PAST_DUE`. There is a cron job that runs every minute
checking for overdue assignments — that polling approach works but a delayed BullMQ job
is more precise and has zero overhead between checks.

```typescript
// jobs
AssignmentJobName.MARK_PAST_DUE // { assignmentId }
```

**How:** when an assignment is created with status `PUBLISHED`, enqueue a delayed job:

```typescript
await this.assignmentQueue.add(
  AssignmentJobName.MARK_PAST_DUE,
  { assignmentId: assignment.id },
  { delay: dueDate.getTime() - Date.now() }, // fires exactly at due date
)
```

---

### Report Generation Queue — `report`

**Where to add:** new `report` module (future feature)

**Why:** generating a PDF report (student grades, batch performance) is CPU-heavy and
can take several seconds. It must never block an HTTP response. The endpoint enqueues
the job and returns immediately; the client polls or receives a push notification when
the report is ready.

```typescript
// jobs
ReportJobName.GENERATE_STUDENT_REPORT // { studentId, semesterId, requestedBy }
ReportJobName.GENERATE_BATCH_REPORT // { batchId, semesterId, requestedBy }
```

---

## Default Job Options (set in `QueueModule`)

```typescript
defaultJobOptions: {
  attempts: 3,                         // retry up to 3 times on failure
  backoff: { type: 'exponential', delay: 1000 },  // 1s → 2s → 4s between retries
  removeOnComplete: true,              // clean up completed jobs from Redis
  removeOnFail: false,                 // keep failed jobs for inspection
}
```

Individual jobs can override these by passing options as the third argument to `queue.add()`:

```typescript
// one-off job with custom retry count
await this.queue.add('job-name', data, { attempts: 5 })

// delayed job (fires after 10 minutes)
await this.queue.add('job-name', data, { delay: 10 * 60 * 1000 })

// high priority job (lower number = higher priority)
await this.queue.add('job-name', data, { priority: 1 })
```
