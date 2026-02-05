import { Controller, Get, Param } from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { Roles } from '@src/auth/decorators/roles.decorator'
import { SemesterService } from './semester.service'

@ApiTags('Semester Management')
@Controller('semesters')
export class SemesterController {
  constructor(private readonly semesterService: SemesterService) {}

  @Get()
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get all semesters' })
  @ApiResponse({ status: 200, description: 'List of all semesters' })
  async findAll() {
    const semesters = await this.semesterService.findAll()
    return {
      message: 'Semesters retrieved successfully',
      data: semesters,
    }
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER, Role.STUDENT)
  @ApiOperation({ summary: 'Get a semester by ID' })
  @ApiParam({ name: 'id', description: 'Semester ID' })
  @ApiResponse({ status: 200, description: 'Semester details' })
  @ApiResponse({ status: 404, description: 'Semester not found' })
  async findOne(@Param('id') id: string) {
    const semester = await this.semesterService.findOneById(id)
    return {
      message: 'Semester retrieved successfully',
      data: semester,
    }
  }
}
