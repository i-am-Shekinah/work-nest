import { UserRole } from 'generated/prisma/enums';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { GetClientQueryDto } from './dto/get-client-query.dto';

@ApiTags('Client')
@Controller('client')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get clients with search & pagination' })
  @ApiOkResponse({
    description: 'List of clients',
    schema: {
      example: {
        data: [
          {
            id: 'clx1234567890',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            phone: '+1234567890',
            isDeleted: false,
            createdAt: '2026-01-29T10:20:30.000Z',
            updatedAt: '2026-01-29T10:20:30.000Z',
          },
        ],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      },
    },
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Search by first name, last name, or email',
    example: 'john',
  })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  async findAll(@Query() dto: GetClientQueryDto) {
    return this.clientService.findAll(dto);
  }

  @Get(':clientId')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get client by ID' })
  @ApiOkResponse({
    description: 'The client details',
    schema: {
      example: {
        id: 'clx1234567890',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567890',
        isDeleted: false,
        createdAt: '2026-01-29T10:20:30.000Z',
        updatedAt: '2026-01-29T10:20:30.000Z',
      },
    },
  })
  async findOne(@Param('clientId') clientId: string) {
    return this.clientService.findOne(clientId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new client' })
  @ApiCreatedResponse({
    description: 'The client has been successfully created',
    schema: {
      example: {
        client: {
          id: 'clx1234567890',
          firstName: 'Alice',
          lastName: 'Johnson',
          email: 'alice.johnson@example.com',
          phone: '+1234567890',
          isDeleted: false,
          createdAt: '2026-01-29T10:20:30.000Z',
          updatedAt: '2026-01-29T10:20:30.000Z',
        },
        success: true,
        message: 'Client created successfully',
      },
    },
  })
  async create(@Body() dto: CreateClientDto) {
    return this.clientService.create(dto);
  }

  @Delete(':clientId')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a client (soft delete)' })
  @ApiNoContentResponse({
    description: 'The client has been successfully deleted',
    schema: {
      example: {
        success: true,
        message: 'Client deleted successfully',
      },
    },
  })
  async delete(@Param('clientId') clientId: string) {
    return this.clientService.delete(clientId);
  }
}