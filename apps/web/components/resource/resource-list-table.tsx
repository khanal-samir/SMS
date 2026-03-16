'use client'

import { useState } from 'react'
import {
  FileText,
  ImageIcon,
  ExternalLink,
  Trash2,
  Pencil,
  Download,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { LoadingState } from '@/components/ui/loading-state'
import { NotFoundState } from '@/components/ui/not-found-state'
import { formatShortDate, formatFileSize } from '@/lib/formatters'
import { useDeleteResource, useUpdateResource, useDownloadResource } from '@/hooks/useResource'
import { EditResourceSheet } from './edit-resource-sheet'
import type { ResourceResponse } from '@repo/schemas'

const resourceTypeConfig = {
  DOCUMENT: { icon: FileText, label: 'Document' },
  IMAGE: { icon: ImageIcon, label: 'Image' },
  LINK: { icon: ExternalLink, label: 'Link' },
} as const

interface ResourceListTableProps {
  resources: ResourceResponse[] | null | undefined
  isLoading: boolean
  showTeacher?: boolean
  readonly?: boolean
  emptyBackHref?: string
}

export function ResourceListTable({
  resources,
  isLoading,
  showTeacher = false,
  readonly = false,
  emptyBackHref = '/teacher/dashboard',
}: ResourceListTableProps) {
  const [editingResource, setEditingResource] = useState<ResourceResponse | null>(null)
  const { mutate: deleteResource, isPending: isDeleting } = useDeleteResource()
  const { mutate: updateResource, isPending: isUpdating } = useUpdateResource()
  const { mutate: downloadResource, isPending: isDownloading } = useDownloadResource()
  const [actionId, setActionId] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setActionId(id)
    deleteResource(id, {
      onSettled: () => setActionId(null),
    })
  }

  const handleTogglePublish = (resource: ResourceResponse) => {
    setActionId(resource.id)
    updateResource(
      { id: resource.id, dto: { isPublished: !resource.isPublished } },
      { onSettled: () => setActionId(null) },
    )
  }

  const handleDownload = (resource: ResourceResponse) => {
    if (resource.resourceType === 'LINK' && resource.externalLink) {
      window.open(resource.externalLink, '_blank')
      return
    }
    setActionId(resource.id)
    downloadResource(resource.id, {
      onSettled: () => setActionId(null),
    })
  }

  if (isLoading) {
    return <LoadingState message="Loading Resources" />
  }

  if (!resources || resources.length === 0) {
    return (
      <NotFoundState
        title="No Resources Found"
        message="No resources available yet. Check back later or create a new resource."
        backButton={{ href: emptyBackHref, label: 'Go Back' }}
      />
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subject</TableHead>
              {showTeacher && <TableHead>Teacher</TableHead>}
              <TableHead>Size</TableHead>
              {!readonly && <TableHead>Status</TableHead>}
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => {
              const typeConfig = resourceTypeConfig[resource.resourceType]
              const TypeIcon = typeConfig.icon
              const isBusy = actionId === resource.id && (isDeleting || isUpdating || isDownloading)

              return (
                <TableRow key={resource.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <TypeIcon className="size-4 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{typeConfig.label}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-semibold text-foreground">{resource.title}</span>
                    {resource.description && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                        {resource.description}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {resource.subjectTeacher.subject.subjectName}
                    <span className="ml-1 text-xs">
                      ({resource.subjectTeacher.subject.subjectCode})
                    </span>
                  </TableCell>
                  {showTeacher && (
                    <TableCell className="text-sm text-muted-foreground">
                      {resource.subjectTeacher.teacher.name}
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-muted-foreground">
                    {resource.fileSize ? formatFileSize(resource.fileSize) : '—'}
                  </TableCell>
                  {!readonly && (
                    <TableCell>
                      <Badge variant={resource.isPublished ? 'success' : 'secondary'}>
                        {resource.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                  )}
                  <TableCell className="text-sm text-muted-foreground">
                    {formatShortDate(resource.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(resource)}
                        disabled={isBusy}
                      >
                        {isDownloading && actionId === resource.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : resource.resourceType === 'LINK' ? (
                          <ExternalLink className="h-3.5 w-3.5" />
                        ) : (
                          <Download className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      {!readonly && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTogglePublish(resource)}
                            disabled={isBusy}
                          >
                            {isUpdating && actionId === resource.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : resource.isPublished ? (
                              <EyeOff className="h-3.5 w-3.5" />
                            ) : (
                              <Eye className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingResource(resource)}
                            disabled={isBusy}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(resource.id)}
                            disabled={isBusy}
                          >
                            {isDeleting && actionId === resource.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {editingResource && (
        <EditResourceSheet
          resource={editingResource}
          open={!!editingResource}
          onOpenChange={(open) => {
            if (!open) setEditingResource(null)
          }}
        />
      )}
    </>
  )
}
