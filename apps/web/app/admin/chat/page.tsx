'use client'

import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { ChatPanel } from '@/components/chat/chat-panel'
import { ChatGroupList } from '@/components/chat/chat-group-list'
import { useChatGroups, useChatSocket } from '@/hooks/useChat'
import { useChatStore } from '@/store/chat.store'

export default function AdminChatPage() {
  const { groups, isLoading } = useChatGroups()
  const { activeGroupId, setActiveGroupId } = useChatStore()
  useChatSocket()

  const activeGroup = groups?.find((g) => g.id === activeGroupId)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          backButton={{ href: '/admin/dashboard', label: 'Dashboard' }}
          title="Chat Groups"
          description="Manage and participate in batch chat groups"
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="flex gap-4">
            {/* Group sidebar */}
            <div className="w-64 shrink-0 rounded-xl border bg-card">
              <div className="border-b px-4 py-3">
                <h3 className="text-sm font-semibold text-foreground">Groups</h3>
              </div>
              <ChatGroupList
                groups={groups ?? []}
                activeGroupId={activeGroupId}
                onSelect={setActiveGroupId}
              />
            </div>

            {/* Chat panel */}
            <div className="flex-1">
              {activeGroupId ? (
                <ChatPanel
                  groupId={activeGroupId}
                  groupName={activeGroup?.name}
                  className="h-[calc(100vh-220px)]"
                />
              ) : (
                <div className="flex h-[calc(100vh-220px)] items-center justify-center rounded-xl border bg-card">
                  <p className="text-sm text-muted-foreground">Select a group to start chatting</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
