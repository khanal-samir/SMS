'use client'

import { useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'
import { MessageBubble } from './message-bubble'
import type { ChatMessage } from '@repo/schemas'

interface MessageListProps {
  messages: ChatMessage[]
  isLoading: boolean
  hasNextPage: boolean
  isFetchingNextPage: boolean
  fetchNextPage: () => void
}

export function MessageList({
  messages,
  isLoading,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevMessageCountRef = useRef(0)

  // Auto-scroll to bottom when new messages arrive (but not when loading older pages)
  useEffect(() => {
    const isNewMessage = messages.length > prevMessageCountRef.current
    prevMessageCountRef.current = messages.length

    if (isNewMessage && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages.length])

  // Scroll to bottom on first load
  useEffect(() => {
    if (!isLoading && messages.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView()
    }
  }, [isLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  // Detect scroll to top for loading older messages
  const handleScroll = () => {
    const container = containerRef.current
    if (!container || !hasNextPage || isFetchingNextPage) return

    if (container.scrollTop < 60) {
      fetchNextPage()
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-gray-400">No messages yet. Start the conversation!</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
    >
      {isFetchingNextPage && (
        <div className="flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        </div>
      )}
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
