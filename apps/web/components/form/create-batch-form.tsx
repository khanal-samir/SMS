'use client'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateBatchSchema, type CreateBatchDto } from '@repo/schemas'
import { useCreateBatch } from '@/hooks/useBatch'
import { Loader2 } from 'lucide-react'

interface CreateBatchFormProps {
  onSuccess?: () => void
}

export function CreateBatchForm({ onSuccess }: CreateBatchFormProps) {
  const { mutate: createBatch, isPending } = useCreateBatch()

  const form = useForm<CreateBatchDto>({
    resolver: zodResolver(CreateBatchSchema),
    defaultValues: {
      batchYear: new Date().getFullYear(),
      startDate: '',
      endDate: undefined,
    },
  })

  const onSubmit = (data: CreateBatchDto) => {
    createBatch(data, {
      onSuccess: () => {
        form.reset()
        onSuccess?.()
      },
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="batchYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Batch Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="2025"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Start Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>End Date (Optional)</FormLabel>
              <FormControl>
                <Input type="date" {...field} value={field.value ?? ''} disabled={isPending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Batch'
          )}
        </Button>
      </form>
    </Form>
  )
}
