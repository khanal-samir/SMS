import { Module } from '@nestjs/common'
import { BatchController } from './batch.controller'
import { BatchService } from './batch.service'
import { SemesterModule } from 'src/semester/semester.module'
import { StudentEnrollmentListener } from './listeners/student-enrollment.listener'

@Module({
  imports: [SemesterModule],
  controllers: [BatchController],
  providers: [BatchService, StudentEnrollmentListener],
  exports: [BatchService],
})
export class BatchModule {}
