import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(1),
  JWT_EXPIRES_IN: z.string().min(1),
  REFRESH_TOKEN_SECRET: z.string().min(1),
  REFRESH_TOKEN_EXPIRES_IN: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_REDIRECT_URI: z.url(),
  PUBLIC_WEB_URL: z.url(),
  SMTP_HOST: z.string().min(1),
  SMTP_USER: z.string().min(1),
  SMTP_PASSWORD: z.string().min(1),
  SMTP_FROM: z.email(),
  ADMIN_EMAILS: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  BE_PORT: z.coerce.number().optional().default(7000),
})

export type Env = z.infer<typeof envSchema>
