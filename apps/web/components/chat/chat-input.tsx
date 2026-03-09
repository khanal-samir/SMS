'use client'

import { type KeyboardEvent } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Send } from 'lucide-react'
import { SendChatMessageSchema, type SendChatMessageDto } from '@repo/schemas'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

const ChatInputSchema = SendChatMessageSchema.pick({ content: true })
type ChatInputFormValues = Pick<SendChatMessageDto, 'content'>

interface ChatInputProps {
  onSend: (content: string) => void
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  disabled = false,
  placeholder = 'Type a message...',
}: ChatInputProps) {
  const form = useForm<ChatInputFormValues>({
    resolver: zodResolver(ChatInputSchema),
    defaultValues: {
      content: '',
    },
  })

  const contentValue = form.watch('content')
  const submitMessage = form.handleSubmit((values) => {
    if (disabled) return
    onSend(values.content.trim())
    form.reset()
  })

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void submitMessage()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={submitMessage} className="flex items-end gap-2 border-t bg-card px-4 py-3">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex-1 gap-1">
              <FormControl>
                <Textarea
                  {...field}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  disabled={disabled}
                  rows={1}
                  className="max-h-32 min-h-[40px] resize-none rounded-xl border-border bg-muted px-3.5 py-2.5"
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !contentValue?.trim()}
          className="h-10 w-10 shrink-0 rounded-xl"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </Form>
  )
}
