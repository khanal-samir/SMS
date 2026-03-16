import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { Env } from 'src/config/env.config'

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name)
  private readonly s3Client: S3Client
  private readonly bucket: string

  constructor(private readonly configService: ConfigService<Env>) {
    this.bucket = this.configService.get('AWS_S3_BUCKET', { infer: true })!
    const region = this.configService.get('AWS_S3_REGION', { infer: true })!

    this.s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID', { infer: true })!,
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY', { infer: true })!,
      },
    })

    this.logger.log(`S3 storage initialized with bucket: ${this.bucket} in region: ${region}`)
  }

  //build a file path
  getObjectKey(subjectTeacherId: string, resourceId: string, fileName: string): string {
    const sanitized = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_')
    return `resources/${subjectTeacherId}/${resourceId}/${sanitized}`
  }

  //Creates a temporary URL the client can use to upload a file directly to S3, bypassing your server
  async generatePresignedUploadUrl(
    key: string,
    contentType: string,
    expiresIn = 300, // 5 minutes
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: contentType,
    })

    const url = await getSignedUrl(this.s3Client, command, { expiresIn })
    this.logger.log(`Generated presigned upload URL for key: ${key}`)
    return url
  }

  // Creates a temporary URL the client can use to download a file directly from S3, bypassing your server
  async generatePresignedDownloadUrl(key: string, expiresIn = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    const url = await getSignedUrl(this.s3Client, command, { expiresIn })
    this.logger.log(`Generated presigned download URL for key: ${key}`)
    return url
  }

  async deleteObject(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key,
    })

    await this.s3Client.send(command)
    this.logger.log(`Deleted S3 object: ${key}`)
  }
}
