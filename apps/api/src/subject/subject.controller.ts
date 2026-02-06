import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { Roles } from '@src/auth/decorators/roles.decorator'
import { SubjectService } from './subject.service'
import { CurrentUser } from '@src/auth/decorators/current-user.decorator'
import type { AuthUser } from '@repo/schemas'

@ApiTags('Subject Management')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get all subjects',
    description:
      'Admin: all subjects. Teacher: assigned subjects only. Student: subjects in current semester only.',
  })
  @ApiResponse({ status: 200, description: 'List of subjects scoped to the current user' })
  async findAll(@CurrentUser() user: AuthUser) {
    const subjects = await this.subjectService.findAll(user)
    return {
      message: 'Subjects retrieved successfully',
      data: subjects,
    }
  }

  @Get('semester/:semesterId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get subjects by semester ID',
    description:
      'Admin: any semester. Teacher: only semesters with assigned subjects. Student: current semester only.',
  })
  @ApiParam({ name: 'semesterId', description: 'Semester ID' })
  @ApiResponse({ status: 200, description: 'List of subjects for the semester' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async findBySemester(@Param('semesterId') semesterId: string, @CurrentUser() user: AuthUser) {
    const subjects = await this.subjectService.findBySemester(semesterId, user)
    return {
      message: 'Subjects retrieved successfully',
      data: subjects,
    }
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get a subject by ID',
    description:
      'Admin: any subject. Teacher: assigned subjects only. Student: subjects in current semester only.',
  })
  @ApiParam({ name: 'id', description: 'Subject ID' })
  @ApiResponse({ status: 200, description: 'Subject details' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const subject = await this.subjectService.findOneById(id, user)
    return {
      message: 'Subject retrieved successfully',
      data: subject,
    }
  }
}
