'use client'

import { useMemo } from 'react'
import { useChatMessages, useChatSocket } from '@/hooks/useChat'
import { useChatStore } from '@/store/chat.store'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'

interface ChatPanelProps {
  groupId: string
  groupName?: string
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

  const mergedMessages = useMemo(() => {
    const realtimeMessages = storeMessages[groupId] ?? []
    const seen = new Set<string>()
    const merged = []

    // fetchedMessages are already globally chronological from useChatMessages.
    for (const message of fetchedMessages) {
      if (seen.has(message.id)) continue
      seen.add(message.id)
      merged.push(message)
    }

    // Real-time messages are append-only in store and are newer than history.
    for (const message of realtimeMessages) {
      if (seen.has(message.id)) continue
      seen.add(message.id)
      merged.push(message)
    }

    return merged
  }, [fetchedMessages, storeMessages, groupId])

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
