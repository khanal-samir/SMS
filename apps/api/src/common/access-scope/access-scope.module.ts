import { Module } from '@nestjs/common'
import { AccessScopeService } from './access-scope.service'

@Module({
  providers: [AccessScopeService],
  exports: [AccessScopeService],
})
export class AccessScopeModule {}
