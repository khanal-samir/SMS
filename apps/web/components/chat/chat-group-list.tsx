'use client'

import { cn } from '@/lib/utils'
import type { ChatGroup } from '@repo/schemas'

interface ChatGroupListProps {
  groups: ChatGroup[]
  activeGroupId: string | null
  onSelect: (groupId: string) => void
}

export function ChatGroupList({ groups, activeGroupId, onSelect }: ChatGroupListProps) {
  if (groups.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-gray-400">No chat groups available.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {groups.map((group) => {
        const isActive = group.id === activeGroupId

        return (
          <button
            key={group.id}
            type="button"
            onClick={() => onSelect(group.id)}
            className={cn(
              'flex flex-col items-start rounded-lg px-3 py-2.5 text-left transition-colors',
              isActive ? 'bg-primary/10 text-primary' : 'text-gray-700 hover:bg-gray-100',
            )}
          >
            <span className="text-sm font-medium">{group.name}</span>
            <span className="text-xs text-gray-400">Batch {group.batch.batchYear}</span>
          </button>
        )
      })}
    </div>
  )
}
