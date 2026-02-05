import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class EnrollStudentDto {
  @ApiProperty({ description: 'Student ID to enroll', example: 'clxyz123abc' })
  @IsNotEmpty()
  @IsString()
  studentId: string
}
