'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateResourceSchema, type UpdateResourceDto, type ResourceResponse } from '@repo/schemas'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'
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
import { Loader2 } from 'lucide-react'
import { useUpdateResource } from '@/hooks/useResource'

interface EditResourceSheetProps {
  resource: ResourceResponse
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditResourceSheet({ resource, open, onOpenChange }: EditResourceSheetProps) {
  const { mutate: updateResource, isPending } = useUpdateResource()

  const form = useForm<UpdateResourceDto>({
    resolver: zodResolver(UpdateResourceSchema),
    defaultValues: {
      title: resource.title,
      description: resource.description ?? '',
    },
  })

  const onSubmit = (data: UpdateResourceDto) => {
    updateResource(
      { id: resource.id, dto: data },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit Resource</SheetTitle>
          <SheetDescription>Update the resource title and description.</SheetDescription>
        </SheetHeader>

        <div className="px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Resource title" {...field} disabled={isPending} />
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
                        placeholder="Resource description..."
                        className="min-h-[80px]"
                        {...field}
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
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
