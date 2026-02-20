'use client'

import { useChatMessages, useChatSocket } from '@/hooks/useChat'
import { useChatStore } from '@/store/chat.store'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'

interface ChatPanelProps {
  groupId: string
  groupName?: string
  /** Height class for the panel. Default: "h-[600px]" */
  className?: string
}

export function ChatPanel({ groupId, groupName, className = 'h-[600px]' }: ChatPanelProps) {
  const { sendMessage } = useChatSocket()
  const { messages: storeMessages } = useChatStore()
  const {
    messages: fetchedMessages,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useChatMessages(groupId)

  // Merge fetched + real-time store messages (deduplicated)
  const realtimeMessages = storeMessages[groupId] ?? []
  const mergedMessages = [...fetchedMessages]
  for (const msg of realtimeMessages) {
    if (!mergedMessages.some((m) => m.id === msg.id)) {
      mergedMessages.push(msg)
    }
  }
  // Sort chronologically
  mergedMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  const handleSend = (content: string) => {
    sendMessage(groupId, content)
  }

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white ${className}`}
    >
      {groupName && (
        <div className="flex items-center border-b border-gray-200 px-4 py-3">
          <h3 className="text-sm font-semibold text-gray-900">{groupName}</h3>
        </div>
      )}
      <MessageList
        messages={mergedMessages}
        isLoading={isLoading}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
      <ChatInput onSend={handleSend} />
    </div>
  )
}
