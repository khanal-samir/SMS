import { Controller, Param, Put, Get } from '@nestjs/common'
import { UserService } from './user.service'
import { Roles } from '@src/auth/decorators/roles.decorator'
import { Role } from '@prisma/client'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

@ApiTags('User Management')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN)
  @Get('/pending-teachers')
  @ApiOperation({ summary: 'Get all pending teachers awaiting approval' })
  @ApiResponse({ status: 200, description: 'List of pending teachers' })
  async getPendingTeachers() {
    const teachers = await this.userService.getPendingTeachers()
    return {
      message: 'Pending teachers retrieved successfully',
      data: teachers,
    }
  }

  @Roles(Role.ADMIN)
  @Put('/approve-teachers/:id')
  @ApiOperation({ summary: 'Approve a teacher account' })
  @ApiResponse({ status: 200, description: 'Teacher approved successfully' })
  async approveTeachers(@Param('id') id: string) {
    const teacher = await this.userService.approveTeacher(id)
    return {
      message: 'Teacher approved successfully',
      data: teacher,
    }
  }
}
