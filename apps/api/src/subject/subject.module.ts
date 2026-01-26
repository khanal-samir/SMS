import { Module } from '@nestjs/common'
import { SubjectService } from './subject.service'

@Module({
  providers: [SubjectService],
  exports: [SubjectService],
})
export class SubjectModule {}
