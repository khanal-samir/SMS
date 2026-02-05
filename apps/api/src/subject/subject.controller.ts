import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { Roles } from '@src/auth/decorators/roles.decorator'
import { SubjectService } from './subject.service'

@ApiTags('Subject Management')
@Controller('subjects')
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all subjects' })
  @ApiResponse({ status: 200, description: 'List of all subjects' })
  async findAll() {
    const subjects = await this.subjectService.findAll()
    return {
      message: 'Subjects retrieved successfully',
      data: subjects,
    }
  }

  @Get('semester/:semesterId')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get subjects by semester ID' })
  @ApiParam({ name: 'semesterId', description: 'Semester ID' })
  @ApiResponse({ status: 200, description: 'List of subjects for the semester' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async findBySemester(@Param('semesterId') semesterId: string) {
    const subjects = await this.subjectService.findBySemester(semesterId)
    return {
      message: 'Subjects retrieved successfully',
      data: subjects,
    }
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a subject by ID' })
  @ApiParam({ name: 'id', description: 'Subject ID' })
  @ApiResponse({ status: 200, description: 'Subject details' })
  @ApiResponse({ status: 404, description: 'Subject not found' })
  async findOne(@Param('id') id: string) {
    const subject = await this.subjectService.findOneById(id)
    return {
      message: 'Subject retrieved successfully',
      data: subject,
    }
  }
}
