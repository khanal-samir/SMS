'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateAnnouncementSchema, type UpdateAnnouncementDto } from '@repo/schemas'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useUpdateAnnouncement } from '@/hooks/useAnnouncement'
import { useBatches } from '@/hooks/useBatch'
import { SchedulePicker } from './schedule-picker'
import type { AnnouncementResponse } from '@repo/schemas'

interface EditAnnouncementDialogProps {
  announcement: AnnouncementResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

function EditAnnouncementDialog({ announcement, open, onOpenChange }: EditAnnouncementDialogProps) {
  const { mutate: updateAnnouncement, isPending } = useUpdateAnnouncement()
  const { data: batches } = useBatches()

  const form = useForm<UpdateAnnouncementDto>({
    resolver: zodResolver(UpdateAnnouncementSchema),
    defaultValues: {
      title: announcement.title,
      message: announcement.message,
      batchId: announcement.batchId ?? undefined,
      scheduledAt: announcement.scheduledAt ?? undefined,
    },
  })

  useEffect(() => {
    form.reset({
      title: announcement.title,
      message: announcement.message,
      batchId: announcement.batchId ?? undefined,
      scheduledAt: announcement.scheduledAt ?? undefined,
    })
  }, [announcement, form])

  const onSubmit = (data: UpdateAnnouncementDto) => {
    updateAnnouncement(
      { id: announcement.id, dto: data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Announcement</DialogTitle>
          <DialogDescription>
            Update the announcement details. Clear &quot;Schedule For&quot; to publish immediately.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Announcement title" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Announcement message..."
                      className="min-h-[120px]"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="batchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Batch (Optional)</FormLabel>
                  <Select
                    onValueChange={(value) =>
                      field.onChange(value === 'global' ? undefined : value)
                    }
                    value={field.value ?? 'global'}
                    disabled={isPending}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Global (all students)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="global">Global (all students)</SelectItem>
                      {batches?.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          Batch {batch.batchYear}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduledAt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Schedule For (Optional)</FormLabel>
                  <FormControl>
                    <SchedulePicker
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Announcement'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export { EditAnnouncementDialog }
