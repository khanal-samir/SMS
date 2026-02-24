import {
  Injectable,
  Logger,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PrismaService } from '@src/prisma/prisma.service'
import { Role } from '@prisma/client'
import {
  CHAT_DEFAULT_MESSAGE_LIMIT,
  CHAT_MAX_MESSAGE_LIMIT,
  CHAT_GROUP_SELECT,
  CHAT_MESSAGE_SELECT,
} from './chat.constants'
import type { AuthUser } from '@repo/schemas'
@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name)

  constructor(private readonly prisma: PrismaService) {}

  async ensureChatGroupForBatch(batchId: string, batchYear?: number) {
    const resolvedBatchYear = batchYear ?? (await this.getBatchYear(batchId))
    const name = `Batch ${resolvedBatchYear} Chat`

    this.logger.log(`Ensuring chat group for batch ${batchId}`)
    return this.prisma.chatGroup.upsert({
      where: { batchId },
      create: {
        batchId,
        name,
      },
      update: {
        name,
      },
      select: CHAT_GROUP_SELECT,
    })
  }

  async findChatGroupById(chatGroupId: string) {
    return this.prisma.chatGroup.findUnique({
      where: { id: chatGroupId },
      select: CHAT_GROUP_SELECT,
    })
  }

  async getGroupsForUser(user: AuthUser) {
    if (user.role === Role.TEACHER) {
      throw new ForbiddenException('Teachers do not have access to chat groups')
    }

    if (user.role === Role.ADMIN) {
      await this.ensureChatGroupsForBatches()
      return this.prisma.chatGroup.findMany({
        orderBy: { createdAt: 'desc' },
        select: CHAT_GROUP_SELECT,
      })
    }

    const student = await this.prisma.user.findUnique({
      where: { id: user.id, role: Role.STUDENT },
      select: {
        batchId: true,
      },
    })

    if (!student?.batchId) {
      return []
    }

    const group = await this.ensureChatGroupForBatch(student.batchId)
    return [group]
  }

  async resolveChatUser(userId: string): Promise<AuthUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    })

    if (!user) {
      throw new NotFoundException('User not found')
    }

    if (user.role === Role.TEACHER) {
      throw new ForbiddenException('Teachers do not have access to chat groups')
    }

    return user
  }

  private async assertAccess(chatGroupId: string, user: AuthUser) {
    if (user.role === Role.TEACHER) {
      throw new ForbiddenException('Teachers do not have access to chat groups')
    }

    const chatGroup = await this.findChatGroupById(chatGroupId)
    if (!chatGroup) {
      throw new NotFoundException(`Chat group with id ${chatGroupId} not found`)
    }

    if (user.role === Role.ADMIN) {
      return chatGroup
    }

    const student = await this.prisma.user.findUnique({
      where: { id: user.id, role: Role.STUDENT },
      select: { batchId: true },
    })

    if (!student?.batchId || student.batchId !== chatGroup.batch.id) {
      throw new ForbiddenException('You do not have access to this chat group')
    }

    return chatGroup
  }

  async getMessages(
    chatGroupId: string,
    user: AuthUser,
    cursor?: string,
    limit = CHAT_DEFAULT_MESSAGE_LIMIT,
  ) {
    await this.assertAccess(chatGroupId, user)

    const safeLimit = Math.min(Math.max(limit, 1), CHAT_MAX_MESSAGE_LIMIT)

    const messages = await this.prisma.chatMessage.findMany({
      where: { chatGroupId },
      orderBy: { createdAt: 'desc' },
      take: safeLimit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      select: CHAT_MESSAGE_SELECT,
    })

    const hasNext = messages.length > safeLimit
    const items = hasNext ? messages.slice(0, safeLimit) : messages
    const nextCursor = hasNext ? (items[items.length - 1]?.id ?? null) : null

    return {
      messages: items.reverse().map((message) => ({
        id: message.id,
        content: message.content,
        chatGroupId: message.chatGroupId,
        createdAt: message.createdAt.toISOString(),
        sender: message.sender,
      })),
      nextCursor,
    }
  }

  async sendMessage(chatGroupId: string, user: AuthUser, content: string) {
    await this.assertAccess(chatGroupId, user)

    const trimmed = content.trim()
    if (!trimmed) {
      throw new BadRequestException('Message cannot be empty')
    }

    const message = await this.prisma.chatMessage.create({
      data: {
        chatGroupId,
        content: trimmed,
        senderId: user.id,
      },
      select: CHAT_MESSAGE_SELECT,
    })

    return {
      id: message.id,
      content: message.content,
      chatGroupId: message.chatGroupId,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
    }
  }

  private async ensureChatGroupsForBatches() {
    const batches = await this.prisma.batch.findMany({
      select: { id: true, batchYear: true },
    })

    if (batches.length === 0) {
      return
    }

    await this.prisma.chatGroup.createMany({
      data: batches.map((batch) => ({
        batchId: batch.id,
        name: `Batch ${batch.batchYear} Chat`,
      })),
      skipDuplicates: true,
    })
  }

  private async getBatchYear(batchId: string) {
    const batch = await this.prisma.batch.findUnique({
      where: { id: batchId },
      select: { batchYear: true },
    })

    if (!batch) {
      throw new NotFoundException(`Batch with id ${batchId} not found`)
    }

    return batch.batchYear
  }
}
