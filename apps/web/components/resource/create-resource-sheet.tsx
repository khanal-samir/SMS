'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateResourceSchema, type CreateResourceDto, RESOURCE_MAX_FILE_SIZE } from '@repo/schemas'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileUpload } from '@/components/ui/file-upload'
import { Loader2 } from 'lucide-react'
import {
  useCreateResource,
  useTeacherSubjectsForResource,
  useAllSubjectTeachersForResource,
} from '@/hooks/useResource'

const DOCUMENT_ACCEPT =
  'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain'
const IMAGE_ACCEPT = 'image/jpeg,image/png,image/webp'

interface CreateResourceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  variant: 'teacher' | 'admin'
}

export function CreateResourceSheet({ open, onOpenChange, variant }: CreateResourceSheetProps) {
  const { mutate: createResource, isPending } = useCreateResource()
  const { data: teacherSubjects } = useTeacherSubjectsForResource()
  const { data: allSubjectTeachers } = useAllSubjectTeachersForResource()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const form = useForm<CreateResourceDto>({
    resolver: zodResolver(CreateResourceSchema),
    defaultValues: {
      title: '',
      description: '',
      resourceType: 'DOCUMENT',
      subjectTeacherId: '',
      fileName: undefined,
      fileSize: undefined,
      mimeType: undefined,
      externalLink: undefined,
    },
  })

  const resourceType = form.watch('resourceType')
  const isFileType = resourceType === 'DOCUMENT' || resourceType === 'IMAGE'
  const isLink = resourceType === 'LINK'

  // Reset conditional fields when resource type changes
  useEffect(() => {
    if (isLink) {
      setSelectedFile(null)
      form.setValue('fileName', undefined)
      form.setValue('fileSize', undefined)
      form.setValue('mimeType', undefined)
    } else {
      form.setValue('externalLink', undefined)
    }
  }, [resourceType, isLink, form])

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file)
    if (file) {
      form.setValue('fileName', file.name)
      form.setValue('fileSize', file.size)
      form.setValue('mimeType', file.type)
      form.clearErrors()
    } else {
      form.setValue('fileName', undefined)
      form.setValue('fileSize', undefined)
      form.setValue('mimeType', undefined)
    }
  }

  const onSubmit = (data: CreateResourceDto) => {
    createResource(
      { dto: data, file: selectedFile ?? undefined },
      {
        onSuccess: () => {
          form.reset()
          setSelectedFile(null)
          onOpenChange(false)
        },
      },
    )
  }

  const fileAccept = resourceType === 'IMAGE' ? IMAGE_ACCEPT : DOCUMENT_ACCEPT

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Upload Resource</SheetTitle>
          <SheetDescription>Share a document, image, or link with your students.</SheetDescription>
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
                        placeholder="Brief description of this resource..."
                        className="min-h-[80px]"
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
                name="resourceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DOCUMENT">Document (PDF, DOC, PPT, XLS, TXT)</SelectItem>
                        <SelectItem value="IMAGE">Image (JPG, PNG, WEBP)</SelectItem>
                        <SelectItem value="LINK">External Link</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subjectTeacherId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{variant === 'admin' ? 'Subject - Teacher' : 'Subject'}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isPending}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              variant === 'admin' ? 'Select a subject-teacher' : 'Select a subject'
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {variant === 'admin'
                          ? allSubjectTeachers?.map((st) => (
                              <SelectItem key={st.id} value={st.id}>
                                {st.subject.subjectName} ({st.subject.subjectCode}) -{' '}
                                {st.teacher.name}
                              </SelectItem>
                            ))
                          : teacherSubjects?.map((st) => (
                              <SelectItem key={st.id} value={st.id}>
                                {st.subject.subjectName} ({st.subject.subjectCode})
                              </SelectItem>
                            ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {isFileType && (
                <div className="space-y-2">
                  <FormLabel>File</FormLabel>
                  <FileUpload
                    onFileSelect={handleFileSelect}
                    selectedFile={selectedFile}
                    accept={fileAccept}
                    maxSize={RESOURCE_MAX_FILE_SIZE}
                    disabled={isPending}
                  />
                  {form.formState.errors.root && (
                    <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
                  )}
                </div>
              )}

              {isLink && (
                <FormField
                  control={form.control}
                  name="externalLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>External URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/resource"
                          {...field}
                          value={field.value ?? ''}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isFileType ? 'Uploading...' : 'Creating...'}
                  </>
                ) : (
                  'Create Resource'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  )
}
