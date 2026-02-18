'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  UpdateAssignmentSchema,
  type UpdateAssignmentDto,
  type AssignmentResponse,
} from '@repo/schemas'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Loader2, Trash2 } from 'lucide-react'
import { useUpdateAssignment, useDeleteAssignment } from '@/hooks/useAssignment'
import { useBatches } from '@/hooks/useBatch'
import { formatDateForInput } from '@/lib/formatters'

interface EditAssignmentDialogProps {
  assignment: AssignmentResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditAssignmentDialog({
  assignment,
  open,
  onOpenChange,
}: EditAssignmentDialogProps) {
  const { mutate: updateAssignment, isPending: isUpdating } = useUpdateAssignment()
  const { mutate: deleteAssignment, isPending: isDeleting } = useDeleteAssignment()
  const { data: batches } = useBatches()

  const form = useForm<UpdateAssignmentDto>({
    resolver: zodResolver(UpdateAssignmentSchema),
    defaultValues: {
      title: assignment.title,
      description: assignment.description ?? '',
      dueDate: formatDateForInput(assignment.dueDate),
      batchId: assignment.batchId,
    },
  })

  // Reset form when assignment changes
  useEffect(() => {
    form.reset({
      title: assignment.title,
      description: assignment.description ?? '',
      dueDate: formatDateForInput(assignment.dueDate),
      batchId: assignment.batchId,
    })
  }, [assignment, form])

  const onSubmit = (data: UpdateAssignmentDto) => {
    updateAssignment(
      { id: assignment.id, dto: data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  const handleDelete = () => {
    deleteAssignment(assignment.id, {
      onSuccess: () => {
        onOpenChange(false)
      },
    })
  }

  const isPending = isUpdating || isDeleting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Assignment</DialogTitle>
          <DialogDescription>
            Update the assignment details. Subject cannot be changed after creation.
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
                    <Input placeholder="Assignment title" {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Assignment description..."
                      className="min-h-[80px]"
                      {...field}
                      value={field.value ?? ''}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} disabled={isPending} />
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
                  <FormLabel>Batch</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a batch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
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

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Subject: {assignment.subjectTeacher.subject.subjectName} (
                {assignment.subjectTeacher.subject.subjectCode})
              </span>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isPending}
                className="mr-auto"
              >
                {isDeleting ? (
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="mr-1 h-4 w-4" />
                )}
                Delete
              </Button>
              <Button type="submit" disabled={isPending}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
