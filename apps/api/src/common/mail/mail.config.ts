import { registerAs } from '@nestjs/config'

export default registerAs('mail', () => ({
  host: process.env.SMTP_HOST,
  user: process.env.SMTP_USER,
  password: process.env.SMTP_PASSWORD,
  from: process.env.SMTP_FROM,
}))
