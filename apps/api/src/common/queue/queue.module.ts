import { Global, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const redisUrl = new URL(configService.getOrThrow<string>('REDIS_URL'))
        // redis://:redis123@localhost:6379
        // │        │        │         │
        // │        │        │         └── redisUrl.port     → "6379"
        // │        │        └──────────── redisUrl.hostname  → "localhost"
        // │        └─────────────────────  redisUrl.password  → "redis123"
        // └──────────────────────────────  redisUrl.protocol  → "redis:

        const isTls = redisUrl.protocol === 'rediss:' // transport layer security for redis, if the protocol is rediss then tls is enabled otherwise not
        return {
          connection: {
            host: redisUrl.hostname,
            port: Number(redisUrl.port) || 6379,
            password: redisUrl.password || undefined,
            tls: isTls ? {} : undefined,
          },
          defaultJobOptions: {
            attempts: 3,
            backoff: {
              type: 'exponential',
              delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
          },
        }
      },
      inject: [ConfigService],
    }),
  ],
})
export class QueueModule {}
