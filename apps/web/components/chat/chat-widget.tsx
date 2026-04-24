'use client'

import { useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { useChatGroups } from '@/hooks/useChat'
import { useChatStore } from '@/store/chat.store'
import { ChatPanel } from './chat-panel'
import { ChatGroupList } from './chat-group-list'

interface ChatWidgetProps {
  /** If true, shows group list first (admin). Otherwise auto-selects first group (student). */
  multiGroup?: boolean
}

export function ChatWidget({ multiGroup = false }: ChatWidgetProps) {
  const { isWidgetOpen, toggleWidget, activeGroupId, setActiveGroupId } = useChatStore()
  const { groups, isLoading } = useChatGroups()

  // Auto-select first group for single-group mode (student)
  useEffect(() => {
    if (!multiGroup && groups && groups.length > 0 && !activeGroupId) {
      setActiveGroupId(groups[0]!.id)
    }
  }, [multiGroup, groups, activeGroupId, setActiveGroupId])

  const activeGroup = groups?.find((g) => g.id === activeGroupId)

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={toggleWidget}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {isWidgetOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat widget panel */}
      {isWidgetOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[380px] overflow-hidden rounded-2xl border bg-card shadow-2xl">
          {multiGroup && !activeGroupId ? (
            <div className="flex h-[500px] flex-col">
              <div className="border-b px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Chat Groups</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-sm text-muted-foreground">Loading groups...</p>
                  </div>
                ) : (
                  <ChatGroupList
                    groups={groups ?? []}
                    activeGroupId={activeGroupId}
                    onSelect={setActiveGroupId}
                  />
                )}
              </div>
            </div>
          ) : activeGroupId ? (
            <div className="flex h-[500px] flex-col">
              {multiGroup && (
                <button
                  type="button"
                  onClick={() => setActiveGroupId(null)}
                  className="border-b px-4 py-2 text-left text-xs font-medium text-primary hover:bg-muted"
                >
                  &larr; Back to groups
                </button>
              )}
              <ChatPanel groupId={activeGroupId} groupName={activeGroup?.name} className="flex-1" />
            </div>
          ) : (
            <div className="flex h-[500px] items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {isLoading ? 'Loading...' : 'No chat groups available.'}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  )
}
