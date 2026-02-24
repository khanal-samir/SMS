import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Logger, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Server, Socket } from 'socket.io'
import { ChatService } from './chat.service'
import type { AuthUser, JwtPayload } from '@repo/schemas'
import { ZodValidationPipe } from 'nestjs-zod'
import { SendMessageDto } from './dto'

type AuthedSocket = Socket & {
  data: {
    user?: AuthUser
  }
}

@WebSocketGateway({
  // same as @controller but for websockets
  namespace: '/chat',
  cors: {
    origin: process.env.PUBLIC_WEB_URL,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name)

  @WebSocketServer()
  private readonly server: Server
  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  // OnGatewayConnection
  async handleConnection(client: AuthedSocket) {
    try {
      const user = await this.authenticate(client)
      client.data.user = user
      await this.joinRooms(client, user)
      this.logger.log(`Socket connected: ${client.id} (user ${user.id})`)
    } catch (error) {
      this.logger.warn(`Socket connection rejected: ${error instanceof Error ? error.message : ''}`)
      client.disconnect()
    }
  }

  // from OnGatewayDisconnect
  handleDisconnect(client: AuthedSocket) {
    const userId = client.data.user?.id
    this.logger.log(`Socket disconnected: ${client.id} (user ${userId ?? 'unknown'})`)
  }

  // gateway ley hamro default pipe ra authentication follow gardena so need seperately use it for this handler
  @UsePipes(new ZodValidationPipe())
  @SubscribeMessage('sendMessage') // same as @Post('sendMessage') but for websockets
  async handleSendMessage(
    @MessageBody() payload: SendMessageDto,
    @ConnectedSocket() client: AuthedSocket,
  ) {
    const user = client.data.user
    if (!user) {
      return
    }

    const message = await this.chatService.sendMessage(payload.chatGroupId, user, payload.content)
    const room = this.roomForChatGroup(payload.chatGroupId)
    this.server.to(room).emit('newMessage', message)
    return message
  }

  private async authenticate(client: Socket) {
    const token = this.extractToken(client)
    if (!token) {
      throw new UnauthorizedException('Access token not found')
    }

    const payload = await this.jwtService.verifyAsync<JwtPayload>(token)
    if (!payload?.sub) {
      throw new UnauthorizedException('Invalid access token')
    }

    return this.chatService.resolveChatUser(payload.sub)
  }

  private extractToken(client: Socket): string | null {
    const authToken = client.handshake.auth?.token
    if (typeof authToken === 'string' && authToken.trim().length > 0) {
      return authToken
    }

    const cookieHeader = client.handshake.headers.cookie
    if (typeof cookieHeader !== 'string') {
      return null
    }

    const cookies = cookieHeader.split(';').reduce<Record<string, string>>((acc, part) => {
      const [key, ...valueParts] = part.trim().split('=')
      if (!key) return acc
      const value = valueParts.join('=')
      try {
        acc[key] = decodeURIComponent(value)
      } catch {
        acc[key] = value
      }
      return acc
    }, {})

    return cookies.accessToken ?? null
  }

  private async joinRooms(client: AuthedSocket, user: AuthUser) {
    const groups = await this.chatService.getGroupsForUser(user)
    const rooms = groups.map((group) => this.roomForChatGroup(group.id))
    if (rooms.length > 0) {
      await client.join(rooms)
    }
  }

  private roomForChatGroup(chatGroupId: string) {
    return `chat-group:${chatGroupId}`
  }
}
