import { Injectable, Logger, Inject } from '@nestjs/common'
import type { ConfigType } from '@nestjs/config'
import { ConfigService } from '@nestjs/config'
import * as nodemailer from 'nodemailer'
import mailConfig from './mail.config'

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name)
  private transporter: nodemailer.Transporter

  constructor(
    @Inject(mailConfig.KEY)
    private mailConfiguration: ConfigType<typeof mailConfig>,
    private readonly configService: ConfigService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.mailConfiguration.host,
      secure: false,
      port: 587,
      auth: {
        user: this.mailConfiguration.user,
        pass: this.mailConfiguration.password,
      },
    })
  }

  async sendVerificationEmail(email: string, name: string, otpCode: string) {
    try {
      await this.transporter.sendMail({
        from: `"SMS Platform" <${this.mailConfiguration.from}>`,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Verify Your Email</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                <h1 style="color: #2c3e50; margin-bottom: 20px;">Welcome to SMS Platform!</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Thank you for registering as a teacher on our School Management System. 
                  To complete your registration and access your account, please verify your email address using the OTP code below.
                </p>
                <div style="text-align: center; margin: 30px 0; background-color: #e8f4f8; padding: 20px; border-radius: 5px;">
                  <p style="font-size: 14px; color: #666; margin-bottom: 10px;">Your verification code:</p>
                  <p style="font-size: 36px; font-weight: bold; color: #007bff; letter-spacing: 5px; margin: 0;">
                    ${otpCode}
                  </p>
                </div>
                <p style="font-size: 16px; margin-bottom: 20px; text-align: center;">
                  Enter this code on the verification page to verify your email.
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="font-size: 12px; color: #999;">
                  If you didn't create an account, you can safely ignore this email.
                </p>
                <p style="font-size: 12px; color: #999;">
                  This verification code will expire in 2 hours.
                </p>
              </div>
            </body>
          </html>
        `,
      })
      this.logger.log(`Verification email sent to ${email}`)
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${email}`, error)
      throw error
    }
  }

  async sendPasswordResetEmail(email: string, name: string, token: string) {
    const publicWebUrl = this.configService.get<string>('PUBLIC_WEB_URL') ?? ''
    const resetUrl = `${publicWebUrl}/reset-password?token=${token}&email=${email}`

    try {
      await this.transporter.sendMail({
        from: `"SMS Platform" <${this.mailConfiguration.from}>`,
        to: email,
        subject: 'Reset Your Password',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Reset Your Password</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                <h1 style="color: #2c3e50; margin-bottom: 20px;">Password Reset Request</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  We received a request to reset your password. Click the button below to create a new password.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${resetUrl}" 
                     style="background-color: #dc3545; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Reset Password
                  </a>
                </div>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 14px; color: #dc3545; word-break: break-all;">
                  ${resetUrl}
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="font-size: 12px; color: #999;">
                  If you didn't request a password reset, you can safely ignore this email. Your password will not be changed.
                </p>
                <p style="font-size: 12px; color: #999;">
                  This password reset link will expire in 1 hour.
                </p>
              </div>
            </body>
          </html>
        `,
      })
      this.logger.log(`Password reset email sent to ${email}`)
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error)
      throw error
    }
  }

  async sendTeacherApprovedEmail(email: string, name: string) {
    const publicWebUrl = this.configService.get<string>('PUBLIC_WEB_URL') ?? ''
    const teacherDashboardUrl = `${publicWebUrl}/teacher/login`

    try {
      await this.transporter.sendMail({
        from: `"SMS Platform" <${this.mailConfiguration.from}>`,
        to: email,
        subject: 'Your Teacher Account Has Been Approved',
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Account Approved</title>
            </head>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background-color: #f8f9fa; padding: 30px; border-radius: 10px;">
                <h1 style="color: #2c3e50; margin-bottom: 20px;">🎉 Account Approved!</h1>
                <p style="font-size: 16px; margin-bottom: 20px;">Hi ${name},</p>
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Great news! Your teacher account has been approved by the administrator. 
                  You can now log in and access your teacher portal.
                </p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${teacherDashboardUrl}" 
                     style="background-color: #28a745; color: white; padding: 14px 28px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                    Go to Teacher Portal
                  </a>
                </div>
                <p style="font-size: 14px; color: #666; margin-top: 30px;">
                  If the button doesn't work, copy and paste this link into your browser:
                </p>
                <p style="font-size: 14px; color: #28a745; word-break: break-all;">
                  ${teacherDashboardUrl}
                </p>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                <p style="font-size: 12px; color: #999;">
                  Welcome to the SMS Platform! We're excited to have you on board.
                </p>
              </div>
            </body>
          </html>
        `,
      })
      this.logger.log(`Teacher approved email sent to ${email}`)
    } catch (error) {
      this.logger.error(`Failed to send teacher approved email to ${email}`, error)
      throw error
    }
  }
}
