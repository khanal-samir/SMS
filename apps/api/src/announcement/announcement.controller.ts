import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { AnnouncementService } from './announcement.service'
import { CreateAnnouncementDto, UpdateAnnouncementDto } from './dto'

@ApiTags('Announcements')
@ApiBearerAuth()
@Controller('announcements')
export class AnnouncementController {
  constructor(private readonly announcementService: AnnouncementService) {}

  @Post()
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Create an announcement',
    description:
      'Admin and teachers can create announcements. ' +
      'Omit scheduledAt to publish immediately; ' +
      'provide a future ISO-8601 date to schedule. ' +
      'Omit batchId for a global announcement visible to everyone.',
  })
  @ApiResponse({ status: 201, description: 'Announcement created successfully' })
  @ApiResponse({ status: 400, description: 'scheduledAt must be a future date' })
  @ApiResponse({ status: 404, description: 'Batch not found' })
  @ApiResponse({ status: 403, description: 'Insufficient permissions' })
  async create(
    @Body() createAnnouncementDto: CreateAnnouncementDto,
    @CurrentUser() user: AuthUser,
  ) {
    const announcement = await this.announcementService.create(createAnnouncementDto, user)
    return {
      message: 'Announcement created successfully',
      data: announcement,
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Get announcements',
    description:
      'Returns announcements scoped to the caller role. ' +
      'Admins see all. Teachers see all published plus their own (incl. scheduled). ' +
      'Students see only published announcements for their batch and global ones.',
  })
  @ApiResponse({ status: 200, description: 'List of announcements' })
  async findAll(@CurrentUser() user: AuthUser) {
    const announcements = await this.announcementService.findAll(user)
    return {
      message: 'Announcements retrieved successfully',
      data: announcements,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single announcement by ID' })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({ status: 200, description: 'Announcement details' })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const announcement = await this.announcementService.findOne(id, user)
    return {
      message: 'Announcement retrieved successfully',
      data: announcement,
    }
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Update an announcement',
    description:
      'Admins can update any announcement. ' +
      'Teachers can only update their own. ' +
      'Setting a new scheduledAt resets the announcement to unpublished so the cron re-picks it up.',
  })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({ status: 200, description: 'Announcement updated successfully' })
  @ApiResponse({ status: 400, description: 'scheduledAt must be a future date' })
  @ApiResponse({ status: 403, description: 'Access denied — not the creator' })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  async update(
    @Param('id') id: string,
    @Body() updateAnnouncementDto: UpdateAnnouncementDto,
    @CurrentUser() user: AuthUser,
  ) {
    const announcement = await this.announcementService.update(id, updateAnnouncementDto, user)
    return {
      message: 'Announcement updated successfully',
      data: announcement,
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({
    summary: 'Delete an announcement',
    description: 'Admins can delete any announcement. Teachers can only delete their own.',
  })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({ status: 200, description: 'Announcement deleted successfully' })
  @ApiResponse({ status: 403, description: 'Access denied — not the creator' })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const result = await this.announcementService.remove(id, user)
    return {
      message: 'Announcement deleted successfully',
      data: result,
    }
  }

  @Post(':id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Mark an announcement as read',
    description:
      'Records that the authenticated user has read this announcement. ' +
      'Idempotent — subsequent calls are no-ops.',
  })
  @ApiParam({ name: 'id', description: 'Announcement ID' })
  @ApiResponse({ status: 200, description: 'Announcement marked as read' })
  @ApiResponse({ status: 403, description: 'Cannot mark an unpublished announcement as read' })
  @ApiResponse({ status: 404, description: 'Announcement not found' })
  async markAsRead(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const result = await this.announcementService.markAsRead(id, user)
    return {
      message: 'Announcement marked as read',
      data: result,
    }
  }
}
