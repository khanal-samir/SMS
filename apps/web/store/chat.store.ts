import { zustandStore } from './zustand.store'
import type { ChatMessage } from '@repo/schemas'

export interface ChatState {
  activeGroupId: string | null
  messages: Record<string, ChatMessage[]>
  isConnected: boolean
  isWidgetOpen: boolean

  setActiveGroupId: (groupId: string | null) => void
  addMessage: (groupId: string, message: ChatMessage) => void
  prependMessages: (groupId: string, messages: ChatMessage[]) => void
  setConnected: (connected: boolean) => void
  setWidgetOpen: (open: boolean) => void
  toggleWidget: () => void
  clearMessages: () => void
}

export const useChatStore = zustandStore<ChatState>(
  (set, get) => ({
    activeGroupId: null,
    messages: {},
    isConnected: false,
    isWidgetOpen: false,

    setActiveGroupId: (groupId) => set({ activeGroupId: groupId }),

    addMessage: (groupId, message) => {
      const current = get().messages[groupId] ?? []
      // Deduplicate — optimistic messages may already exist
      if (current.some((m) => m.id === message.id)) return
      set({
        messages: {
          ...get().messages,
          [groupId]: [...current, message],
        },
      })
    },

    prependMessages: (groupId, messages) => {
      const current = get().messages[groupId] ?? []
      const existingIds = new Set(current.map((m) => m.id))
      const newMessages = messages.filter((m) => !existingIds.has(m.id))
      set({
        messages: {
          ...get().messages,
          [groupId]: [...newMessages, ...current],
        },
      })
    },

    setConnected: (connected) => set({ isConnected: connected }),

    setWidgetOpen: (open) => set({ isWidgetOpen: open }),

    toggleWidget: () => set({ isWidgetOpen: !get().isWidgetOpen }),

    clearMessages: () =>
      set({ messages: {}, activeGroupId: null, isConnected: false, isWidgetOpen: false }),
  }),
  {
    devtoolsEnabled: false,
  },
)
