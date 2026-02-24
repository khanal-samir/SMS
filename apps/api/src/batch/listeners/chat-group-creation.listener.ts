import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ChatService } from '@src/chat/chat.service'
import { BatchCreatedEvent, BATCH_CREATED_EVENT } from '../events/batch-created.event'

@Injectable()
export class ChatGroupCreationListener {
  private readonly logger = new Logger(ChatGroupCreationListener.name)

  constructor(private readonly chatService: ChatService) {}

  @OnEvent(BATCH_CREATED_EVENT)
  async handleBatchCreated(event: BatchCreatedEvent) {
    this.logger.log(`Creating chat group for batch ${event.batchId}`)
    await this.chatService.ensureChatGroupForBatch(event.batchId, event.batchYear)
  }
}
