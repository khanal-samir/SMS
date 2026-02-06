import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { Roles } from '@src/auth/decorators/roles.decorator'
import { SemesterService } from './semester.service'
import { CurrentUser } from '@src/auth/decorators/current-user.decorator'
import type { AuthUser } from '@repo/schemas'

@ApiTags('Semester Management')
@Controller('semesters')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get all semesters',
    description:
      'Admin: all semesters. Teacher: semesters with assigned subjects. Student: current semester only.',
  })
  @ApiResponse({ status: 200, description: 'List of semesters scoped to the current user' })
  async findAll(@CurrentUser() user: AuthUser) {
    const semesters = await this.semesterService.findAll(user)
    return {
      message: 'Semesters retrieved successfully',
      data: semesters,
    }
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({
    summary: 'Get a semester by ID',
    description:
      'Admin: any semester. Teacher: only semesters with assigned subjects. Student: current semester only.',
  })
  @ApiParam({ name: 'id', description: 'Semester ID' })
  @ApiResponse({ status: 200, description: 'Semester details' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const semester = await this.semesterService.findOneById(id, user)
    return {
      message: 'Semester retrieved successfully',
      data: semester,
    }
  }
}
