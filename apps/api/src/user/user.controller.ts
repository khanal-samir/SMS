import { Controller, Param, Put, Get, Post, Body } from '@nestjs/common'
import { AdminService } from './admin.service'
import { Roles } from '@src/auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { AssignTeacherSubjectDto } from './dto/assign-teacher-subject.dto'

@ApiTags('User Management')
@Controller('user')
export class UserController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @Get('/pending-teachers')
  @ApiOperation({ summary: 'Get all pending teachers awaiting approval' })
  @ApiResponse({ status: 200, description: 'List of pending teachers' })
  async getPendingTeachers() {
    const teachers = await this.adminService.getPendingTeachers()
    return {
      message: 'Pending teachers retrieved successfully',
      data: teachers,
    }
  }

  @Roles(Role.ADMIN)
  @Get('/approved-teachers')
  @ApiOperation({ summary: 'Get all approved teachers' })
  @ApiResponse({ status: 200, description: 'List of approved teachers' })
  async getApprovedTeachers() {
    const teachers = await this.adminService.getApprovedTeachers()
    return {
      message: 'Approved teachers retrieved successfully',
      data: teachers,
    }
  }

  @Roles(Role.ADMIN)
  @Put('/approve-teachers/:id')
  @ApiOperation({ summary: 'Approve a teacher account' })
  @ApiResponse({ status: 200, description: 'Teacher approved successfully' })
  async approveTeachers(@Param('id') id: string) {
    const teacher = await this.adminService.approveTeacher(id)
    return {
      message: 'Teacher approved successfully',
      data: teacher,
    }
  }

  @Roles(Role.ADMIN)
  @Post('/assign-teacher-subject')
  @ApiOperation({ summary: 'Assign a teacher to a subject' })
  @ApiBody({ type: AssignTeacherSubjectDto })
  @ApiResponse({ status: 201, description: 'Teacher assigned to subject successfully' })
  async assignTeacherToSubject(@Body() dto: AssignTeacherSubjectDto) {
    const assignment = await this.adminService.assignTeacherToSubject(dto.teacherId, dto.subjectId)
    return {
      message: 'Teacher assigned to subject successfully',
      data: assignment,
    }
  }

  @Roles(Role.ADMIN)
  @Post('/unassign-teacher-subject')
  @ApiOperation({ summary: 'Unassign a teacher from a subject' })
  @ApiBody({ type: AssignTeacherSubjectDto })
  @ApiResponse({ status: 200, description: 'Teacher unassigned from subject successfully' })
  async unassignTeacherFromSubject(@Body() dto: AssignTeacherSubjectDto) {
    const assignment = await this.adminService.unassignTeacherFromSubject(
      dto.teacherId,
      dto.subjectId,
    )
    return {
      message: 'Teacher unassigned from subject successfully',
      data: assignment,
    }
  }
}
