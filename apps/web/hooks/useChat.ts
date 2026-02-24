import { useEffect, useCallback, useRef } from 'react'
import { useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query'
import { chatApi } from '@/apis/chat.api'
import { useChatStore } from '@/store/chat.store'
import { getChatSocket, disconnectChatSocket } from '@/lib/socket'
import { QUERY_KEYS } from '@/lib/query-keys'
import type { ChatMessage, ChatGroup } from '@repo/schemas'

export const useChatGroups = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.CHAT_GROUPS],
    queryFn: async () => {
      const response = await chatApi.getGroups()
      return response.data ?? []
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  return {
    groups: query.data as ChatGroup[] | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  }
}

export const useChatMessages = (groupId: string) => {
  const query = useInfiniteQuery({
    queryKey: [QUERY_KEYS.CHAT_MESSAGES, groupId],
    queryFn: async ({ pageParam }: { pageParam: string | undefined }) => {
      const response = await chatApi.getMessages({
        groupId,
        cursor: pageParam,
        limit: 50,
      })
      return response.data!
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!groupId,
    staleTime: 30 * 1000,
  })

  // Flatten pages into a single message array (oldest first)
  const messages: ChatMessage[] = query.data?.pages.flatMap((page) => page.messages) ?? []

  return {
    messages,
    isLoading: query.isLoading,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: !!query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
    isError: query.isError,
  }
}

// ---------------------------------------------------------------------------
// Socket hook — manages connection lifecycle and real-time messages
// ---------------------------------------------------------------------------

export const useChatSocket = () => {
  const { setConnected, addMessage } = useChatStore()
  const queryClient = useQueryClient()
  const connectedRef = useRef(false)

  useEffect(() => {
    const socket = getChatSocket()

    const onConnect = () => {
      connectedRef.current = true
      setConnected(true)
    }

    const onDisconnect = () => {
      connectedRef.current = false
      setConnected(false)
    }

    const onNewMessage = (message: ChatMessage) => {
      // Add to Zustand store for immediate UI update
      addMessage(message.chatGroupId, message)
      // Also invalidate the React Query cache so the next fetch is fresh
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.CHAT_MESSAGES, message.chatGroupId],
      })
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('newMessage', onNewMessage)

    if (!socket.connected) {
      socket.connect()
    } else {
      onConnect()
    }

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('newMessage', onNewMessage)
    }
  }, [setConnected, addMessage, queryClient])

  const sendMessage = useCallback((chatGroupId: string, content: string) => {
    const socket = getChatSocket()
    if (!socket.connected) return
    socket.emit('sendMessage', { chatGroupId, content })
  }, [])

  const disconnect = useCallback(() => {
    disconnectChatSocket()
    setConnected(false)
  }, [setConnected])

  return { sendMessage, disconnect }
}
