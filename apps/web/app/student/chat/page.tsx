'use client'

import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { PageHeader } from '@/components/ui/page-header'
import { ChatPanel } from '@/components/chat/chat-panel'
import { useChatGroups, useChatSocket } from '@/hooks/useChat'
import { useChatStore } from '@/store/chat.store'

export default function StudentChatPage() {
  const { groups, isLoading } = useChatGroups()
  const { activeGroupId, setActiveGroupId } = useChatStore()
  useChatSocket()

  // Auto-select the student's single batch group
  useEffect(() => {
    if (groups && groups.length > 0 && !activeGroupId) {
      setActiveGroupId(groups[0]!.id)
    }
  }, [groups, activeGroupId, setActiveGroupId])

  const activeGroup = groups?.find((g) => g.id === activeGroupId)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          backButton={{ href: '/student/dashboard', label: 'Dashboard' }}
          title="Batch Chat"
          description={activeGroup ? activeGroup.name : 'Chat with your batchmates'}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : activeGroupId ? (
          <ChatPanel
            groupId={activeGroupId}
            groupName={activeGroup?.name}
            className="h-[calc(100vh-220px)]"
          />
        ) : (
          <div className="rounded-lg border bg-card py-16 text-center shadow-sm">
            <p className="text-muted-foreground">
              You are not enrolled in a batch yet. Chat will be available once you join a batch.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
