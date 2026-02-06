import { Module } from '@nestjs/common'
import { SemesterService } from './semester.service'
import { SemesterController } from './semester.controller'
import { AccessScopeModule } from '@src/common/access-scope/access-scope.module'

@Module({
  imports: [AccessScopeModule],
  controllers: [SemesterController],
  providers: [SemesterService],
  exports: [SemesterService],
})
export class SemesterModule {}
