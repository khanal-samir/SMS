import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { DashboardService } from './dashboard.service'

@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('student')
  @Roles(Role.STUDENT)
  @ApiOperation({ summary: 'Get student dashboard data' })
  @ApiResponse({ status: 200, description: 'Student dashboard data' })
  async getStudentDashboard(@CurrentUser() user: AuthUser) {
    const data = await this.dashboardService.getStudentDashboard(user)
    return {
      message: 'Student dashboard retrieved successfully',
      data,
    }
  }

  @Get('teacher')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Get teacher dashboard data' })
  @ApiResponse({ status: 200, description: 'Teacher dashboard data' })
  async getTeacherDashboard(@CurrentUser() user: AuthUser) {
    const data = await this.dashboardService.getTeacherDashboard(user)
    return {
      message: 'Teacher dashboard retrieved successfully',
      data,
    }
  }

  @Get('admin')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get admin dashboard data' })
  @ApiResponse({ status: 200, description: 'Admin dashboard data' })
  async getAdminDashboard() {
    const data = await this.dashboardService.getAdminDashboard()
    return {
      message: 'Admin dashboard retrieved successfully',
      data,
    }
  }
}
