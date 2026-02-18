import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { AssignmentService } from './assignment.service'
import { CreateAssignmentDto, UpdateAssignmentDto, UpdateAssignmentStatusDto } from './dto'

@ApiTags('Assignment Management')
@Controller('assignments')
export class AssignmentController {
  constructor(private readonly assignmentService: AssignmentService) {}

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new assignment' })
  @ApiResponse({ status: 201, description: 'Assignment created successfully' })
  @ApiResponse({ status: 403, description: 'Teacher not assigned to this subject' })
  @ApiResponse({ status: 404, description: 'Batch not found' })
  async create(@Body() createAssignmentDto: CreateAssignmentDto, @CurrentUser() user: AuthUser) {
    const assignment = await this.assignmentService.create(createAssignmentDto, user)
    return {
      message: 'Assignment created successfully',
      data: assignment,
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get assignments based on user role' })
  @ApiResponse({ status: 200, description: 'List of assignments' })
  async findAll(@CurrentUser() user: AuthUser) {
    const assignments = await this.assignmentService.findAll(user)
    return {
      message: 'Assignments retrieved successfully',
      data: assignments,
    }
  }

  @Get('my-subjects')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Get subject-teacher records for the authenticated teacher' })
  @ApiResponse({ status: 200, description: 'List of subject-teacher records' })
  async getTeacherSubjects(@CurrentUser('id') teacherId: string) {
    const subjects = await this.assignmentService.getTeacherSubjects(teacherId)
    return {
      message: 'Teacher subjects retrieved successfully',
      data: subjects,
    }
  }

  @Get('all-subject-teachers')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all subject-teacher records (admin only)' })
  @ApiResponse({ status: 200, description: 'List of all subject-teacher records' })
  async getAllSubjectTeachers() {
    const subjects = await this.assignmentService.getAllSubjectTeachers()
    return {
      message: 'All subject-teacher records retrieved successfully',
      data: subjects,
    }
  }

  @Get('by-subject-teacher/:subjectTeacherId')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Get assignments for a specific subject-teacher' })
  @ApiParam({ name: 'subjectTeacherId', description: 'SubjectTeacher ID' })
  @ApiResponse({ status: 200, description: 'List of assignments for the subject' })
  @ApiResponse({ status: 403, description: 'Teacher not assigned to this subject' })
  async findBySubjectTeacher(
    @Param('subjectTeacherId') subjectTeacherId: string,
    @CurrentUser() user: AuthUser,
  ) {
    const assignments = await this.assignmentService.findBySubjectTeacher(subjectTeacherId, user)
    return {
      message: 'Assignments retrieved successfully',
      data: assignments,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single assignment by ID' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment details' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const assignment = await this.assignmentService.findOne(id, user)
    return {
      message: 'Assignment retrieved successfully',
      data: assignment,
    }
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update an assignment' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment updated successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @Body() updateAssignmentDto: UpdateAssignmentDto,
    @CurrentUser() user: AuthUser,
  ) {
    const assignment = await this.assignmentService.update(id, updateAssignmentDto, user)
    return {
      message: 'Assignment updated successfully',
      data: assignment,
    }
  }

  @Patch(':id/status')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update assignment status (for Kanban drag-and-drop)' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment status updated successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateAssignmentStatusDto,
    @CurrentUser() user: AuthUser,
  ) {
    const assignment = await this.assignmentService.updateStatus(id, updateStatusDto, user)
    return {
      message: 'Assignment status updated successfully',
      data: assignment,
    }
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete an assignment' })
  @ApiParam({ name: 'id', description: 'Assignment ID' })
  @ApiResponse({ status: 200, description: 'Assignment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Assignment not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const result = await this.assignmentService.remove(id, user)
    return {
      message: 'Assignment deleted successfully',
      data: result,
    }
  }
}
