import { Module } from '@nestjs/common'
import { BatchController } from './batch.controller'
import { BatchService } from './batch.service'
import { SemesterModule } from 'src/semester/semester.module'
import { ChatGroupCreationListener, StudentEnrollmentListener } from './listeners'
import { ChatModule } from '@src/chat/chat.module'

@Module({
  imports: [SemesterModule, ChatModule],
  controllers: [BatchController],
  providers: [BatchService, StudentEnrollmentListener, ChatGroupCreationListener],
  exports: [BatchService],
})
export class BatchModule {}
