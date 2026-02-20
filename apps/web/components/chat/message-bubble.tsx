'use client'

import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/ui/user-avatar'
import { useAuthStore } from '@/store/auth.store'
import type { ChatMessage } from '@repo/schemas'

interface MessageBubbleProps {
  message: ChatMessage
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuthStore()
  const isOwn = user?.id === message.sender.id

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={cn('flex gap-2.5', isOwn ? 'flex-row-reverse' : 'flex-row')}>
      {!isOwn && (
        <UserAvatar
          name={message.sender.name}
          image={message.sender.image}
          size="sm"
          className="mt-0.5 shrink-0"
        />
      )}

      <div className={cn('flex max-w-[75%] flex-col', isOwn ? 'items-end' : 'items-start')}>
        {!isOwn && (
          <span className="mb-0.5 text-xs font-medium text-gray-500">{message.sender.name}</span>
        )}
        <div
          className={cn(
            'rounded-2xl px-3.5 py-2 text-sm leading-relaxed',
            isOwn
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'rounded-bl-md bg-gray-100 text-gray-900',
          )}
        >
          {message.content}
        </div>
        <span className="mt-0.5 text-[10px] text-gray-400">{time}</span>
      </div>
    </div>
  )
}
