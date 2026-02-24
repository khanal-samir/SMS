import { Controller, Get, Param, Query } from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { Role } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { ChatService } from './chat.service'
import { GetChatMessagesQueryDto } from './dto'

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('groups')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({
    summary: 'Get accessible chat groups',
    description: 'Admins see all batch chat groups. Students see their batch group.',
  })
  @ApiResponse({ status: 200, description: 'Chat groups retrieved successfully' })
  async getGroups(@CurrentUser() user: AuthUser) {
    const groups = await this.chatService.getGroupsForUser(user)
    return {
      message: 'Chat groups retrieved successfully',
      data: groups,
    }
  }

  @Get('groups/:id/messages')
  @Roles(Role.ADMIN, Role.STUDENT)
  @ApiOperation({
    summary: 'Get chat messages for a group',
    description: 'Returns paginated chat messages for the selected group.',
  })
  @ApiParam({ name: 'id', description: 'Chat group ID' })
  @ApiQuery({ name: 'cursor', required: false, description: 'Message cursor (message ID)' })
  @ApiQuery({ name: 'limit', required: false, description: 'Max messages to return (1-100)' })
  @ApiResponse({ status: 200, description: 'Chat messages retrieved successfully' })
  async getMessages(
    @Param('id') chatGroupId: string,
    @Query() query: GetChatMessagesQueryDto,
    @CurrentUser() user: AuthUser,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const page = await this.chatService.getMessages(chatGroupId, user, query.cursor, query.limit)
    return {
      message: 'Chat messages retrieved successfully',
      data: page,
    }
  }
}
