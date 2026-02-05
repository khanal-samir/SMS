import { Controller, Get, Post, Body, Param } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { Role } from '@prisma/client'
import { Roles } from 'src/auth/decorators/roles.decorator'
import { BatchService } from './batch.service'
import { CreateBatchDto, EnrollStudentDto } from './dto'

@ApiTags('Batch Management')
@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create a new batch' })
  @ApiResponse({ status: 201, description: 'Batch created successfully' })
  @ApiResponse({ status: 409, description: 'Batch for this year already exists' })
  async create(@Body() createBatchDto: CreateBatchDto) {
    const batch = await this.batchService.create(createBatchDto)
    return {
      message: 'Batch created successfully',
      data: batch,
    }
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all batches' })
  @ApiResponse({ status: 200, description: 'List of all batches' })
  async findAll() {
    const batches = await this.batchService.findAll()
    return {
      message: 'Batches retrieved successfully',
      data: batches,
    }
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get a batch by ID' })
  @ApiParam({ name: 'id', description: 'Batch ID' })
  @ApiResponse({ status: 200, description: 'Batch details' })
  @ApiResponse({ status: 404, description: 'Batch not found' })
  async findOne(@Param('id') id: string) {
    const batch = await this.batchService.findOne(id)
    return {
      message: 'Batch retrieved successfully',
      data: batch,
    }
  }

  @Post(':id/enroll')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Enroll a single student in a batch' })
  @ApiParam({ name: 'id', description: 'Batch ID' })
  @ApiResponse({ status: 200, description: 'Student enrolled successfully' })
  @ApiResponse({ status: 404, description: 'Batch or student not found' })
  @ApiResponse({ status: 400, description: 'Invalid enrollment request' })
  @ApiResponse({ status: 409, description: 'Student already enrolled' })
  async enrollStudent(@Param('id') id: string, @Body() enrollStudentDto: EnrollStudentDto) {
    const student = await this.batchService.enrollStudent(id, enrollStudentDto)
    return {
      message: 'Student enrolled successfully',
      data: student,
    }
  }

  @Post(':id/advance-semester')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Advance batch to the next semester' })
  @ApiParam({ name: 'id', description: 'Batch ID' })
  @ApiResponse({ status: 200, description: 'Batch advanced to next semester' })
  @ApiResponse({ status: 404, description: 'Batch not found' })
  @ApiResponse({ status: 400, description: 'Cannot advance semester' })
  async advanceSemester(@Param('id') id: string) {
    const batch = await this.batchService.advanceSemester(id)
    return {
      message: 'Batch advanced to next semester successfully',
      data: batch,
    }
  }

  @Get(':id/students')
  @Roles(Role.ADMIN, Role.TEACHER)
  @ApiOperation({ summary: 'Get all students in a batch' })
  @ApiParam({ name: 'id', description: 'Batch ID' })
  @ApiResponse({ status: 200, description: 'List of students in batch' })
  @ApiResponse({ status: 404, description: 'Batch not found' })
  async getStudents(@Param('id') id: string) {
    const students = await this.batchService.getStudentsInBatch(id)
    return {
      message: 'Students retrieved successfully',
      data: students,
    }
  }
}
