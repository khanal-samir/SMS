import { z } from 'zod'

export const ResourceTypeEnum = z.enum(['DOCUMENT', 'IMAGE', 'LINK'])
export type ResourceType = z.infer<typeof ResourceTypeEnum>

const ALLOWED_MIME_TYPES = [
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
] as const

export const RESOURCE_ALLOWED_MIME_TYPES = ALLOWED_MIME_TYPES
export const RESOURCE_MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export const CreateResourceSchema = z
  .object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be 200 characters or less'),
    description: z.string().max(2000, 'Description must be 2000 characters or less').optional(),
    resourceType: ResourceTypeEnum,
    subjectTeacherId: z.cuid('Subject teacher is required'),
    // File upload fields (required for DOCUMENT and IMAGE types)
    fileName: z.string().optional(),
    fileSize: z.number().max(RESOURCE_MAX_FILE_SIZE, 'File size must be 10MB or less').optional(),
    mimeType: z
      .string()
      .refine(
        (val) => ALLOWED_MIME_TYPES.includes(val as (typeof ALLOWED_MIME_TYPES)[number]),
        'Unsupported file type',
      )
      .optional(),
    // Link field (required for LINK type)
    externalLink: z.url('Invalid URL').optional(),
  })
  .refine(
    (data) => {
      if (data.resourceType === ResourceTypeEnum.enum.LINK) {
        return !!data.externalLink
      }
      return !!data.fileName && !!data.fileSize && !!data.mimeType
    },
    {
      message:
        'File details (fileName, fileSize, mimeType) are required for DOCUMENT/IMAGE resources. External link is required for LINK resources.',
    },
  )
export type CreateResourceDto = z.infer<typeof CreateResourceSchema>

export const UpdateResourceSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must be 200 characters or less')
    .optional(),
  description: z.string().max(2000, 'Description must be 2000 characters or less').optional(),
  isPublished: z.boolean().optional(),
})
export type UpdateResourceDto = z.infer<typeof UpdateResourceSchema>

export const ResourceResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  resourceType: ResourceTypeEnum,
  fileUrl: z.string().nullable(),
  fileName: z.string().nullable(),
  fileSize: z.number().nullable(),
  mimeType: z.string().nullable(),
  externalLink: z.string().nullable(),
  isUploaded: z.boolean(),
  isPublished: z.boolean(),
  publishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  subjectTeacherId: z.string(),
  subjectTeacher: z.object({
    id: z.string(),
    subject: z.object({
      id: z.string(),
      subjectCode: z.string(),
      subjectName: z.string(),
    }),
    teacher: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
})
export type ResourceResponse = z.infer<typeof ResourceResponseSchema>

export const CreateResourceResponseSchema = z.object({
  resource: ResourceResponseSchema,
  uploadUrl: z.string().nullable(),
})
export type CreateResourceResponse = z.infer<typeof CreateResourceResponseSchema>
