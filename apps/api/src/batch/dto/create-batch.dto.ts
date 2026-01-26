import { IsInt, IsNotEmpty, IsDateString, Min, IsOptional } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class CreateBatchDto {
  @ApiProperty({ description: 'The batch year (e.g., 2024)', example: 2024 })
  @IsNotEmpty()
  @IsInt()
  @Min(2000)
  batchYear: number

  @ApiProperty({ description: 'Start date of the batch', example: '2024-01-01' })
  @IsNotEmpty()
  @IsDateString()
  startDate: string

  @ApiPropertyOptional({ description: 'End date of the batch', example: '2028-12-31' })
  @IsOptional()
  @IsDateString()
  endDate?: string
}
