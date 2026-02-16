import { Controller, Param, Put, Get, Post, Body } from '@nestjs/common'
import { AdminService } from './admin.service'
import { UserService } from './user.service'
import { Roles } from '@src/auth/decorators/roles.decorator'
import { CurrentUser } from '@src/auth/decorators/current-user.decorator'
import { Role } from '@prisma/client'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { AssignTeacherSubjectDto } from './dto/assign-teacher-subject.dto'

@ApiTags('User Management')
@Controller('user')
export class UserController {
  constructor(
    private readonly adminService: AdminService,
    private readonly userService: UserService,
  ) {}

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
  @Get('/all')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  async getAllUsers() {
    const users = await this.adminService.getAllUsers()
    return {
      message: 'All users retrieved successfully',
      data: users,
    }
  }

  @Roles(Role.STUDENT)
  @Get('/student/me')
  @ApiOperation({ summary: 'Get current student details with semester history' })
  @ApiResponse({ status: 200, description: 'Student details retrieved successfully' })
  async getMyStudentDetail(@CurrentUser('id') userId: string) {
    const student = await this.userService.getStudentDetail(userId)
    return {
      message: 'Student details retrieved successfully',
      data: student,
    }
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @Get('/student/:id')
  @ApiOperation({ summary: 'Get student details by ID with semester history' })
  @ApiResponse({ status: 200, description: 'Student details retrieved successfully' })
  async getStudentDetail(@Param('id') studentId: string) {
    const student = await this.userService.getStudentDetail(studentId)
    return {
      message: 'Student details retrieved successfully',
      data: student,
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
