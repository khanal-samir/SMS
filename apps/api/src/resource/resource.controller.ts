import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import type { AuthUser } from '@repo/schemas'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { CurrentUser } from 'src/auth/decorators/current-user.decorator'
import { ResourceService } from './resource.service'
import { CreateResourceDto, UpdateResourceDto } from './dto'

@ApiTags('Resource Management')
@Controller('resources')
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post()
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Create a new resource (returns presigned upload URL for file types)' })
  @ApiResponse({ status: 201, description: 'Resource created successfully' })
  @ApiResponse({ status: 403, description: 'Teacher not assigned to this subject' })
  async create(@Body() createResourceDto: CreateResourceDto, @CurrentUser() user: AuthUser) {
    const result = await this.resourceService.create(createResourceDto, user)
    return {
      message: 'Resource created successfully',
      data: result,
    }
  }

  @Patch(':id/confirm')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Confirm file upload completed for a resource' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Upload confirmed' })
  @ApiResponse({
    status: 400,
    description: 'Invalid confirmation (LINK type or already confirmed)',
  })
  async confirmUpload(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const resource = await this.resourceService.confirmUpload(id, user)
    return {
      message: 'Upload confirmed successfully',
      data: resource,
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get resources based on user role' })
  @ApiResponse({ status: 200, description: 'List of resources' })
  async findAll(@CurrentUser() user: AuthUser) {
    const resources = await this.resourceService.findAll(user)
    return {
      message: 'Resources retrieved successfully',
      data: resources,
    }
  }

  @Get('my-subjects')
  @Roles(Role.TEACHER)
  @ApiOperation({ summary: 'Get subject-teacher records for the authenticated teacher' })
  @ApiResponse({ status: 200, description: 'List of subject-teacher records' })
  async getTeacherSubjects(@CurrentUser('id') teacherId: string) {
    const subjects = await this.resourceService.getTeacherSubjects(teacherId)
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
    const subjects = await this.resourceService.getAllSubjectTeachers()
    return {
      message: 'All subject-teacher records retrieved successfully',
      data: subjects,
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single resource by ID' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource details' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const resource = await this.resourceService.findOne(id, user)
    return {
      message: 'Resource retrieved successfully',
      data: resource,
    }
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Get a presigned download URL for a resource file' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Presigned download URL' })
  @ApiResponse({ status: 400, description: 'No file to download' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  async getDownloadUrl(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const result = await this.resourceService.getDownloadUrl(id, user)
    return {
      message: 'Download URL generated successfully',
      data: result,
    }
  }

  @Patch(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update resource metadata' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource updated successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
    @CurrentUser() user: AuthUser,
  ) {
    const resource = await this.resourceService.update(id, updateResourceDto, user)
    return {
      message: 'Resource updated successfully',
      data: resource,
    }
  }

  @Delete(':id')
  @Roles(Role.TEACHER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete a resource and its S3 file' })
  @ApiParam({ name: 'id', description: 'Resource ID' })
  @ApiResponse({ status: 200, description: 'Resource deleted successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    const result = await this.resourceService.remove(id, user)
    return {
      message: 'Resource deleted successfully',
      data: result,
    }
  }
}
