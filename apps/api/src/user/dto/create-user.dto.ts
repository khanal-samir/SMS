import { IsEmail, IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator'
import { Role } from '@prisma/client'

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsOptional()
  @IsEnum(Role)
  role?: Role
}
