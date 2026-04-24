'use client'

import { useChatSocketLifecycle } from '@/hooks/useChat'

export function ChatSocketProvider() {
  useChatSocketLifecycle()
  return null
}
