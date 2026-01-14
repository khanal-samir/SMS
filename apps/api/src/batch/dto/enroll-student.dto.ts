import { IsNotEmpty, IsString, IsArray, ArrayMinSize } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class EnrollStudentDto {
  @ApiProperty({ description: 'Student ID to enroll', example: 'clxyz123abc' })
  @IsNotEmpty()
  @IsString()
  studentId: string
}

export class EnrollStudentsDto {
  @ApiProperty({
    description: 'Array of student IDs to enroll',
    example: ['clxyz123abc', 'clxyz456def'],
    type: [String],
  })
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  studentIds: string[]
}
