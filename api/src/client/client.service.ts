import { PrismaService } from 'src/prisma/prisma.service';

import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { CreateClientDto } from './dto/create-client.dto';
import { GetClientQueryDto } from './dto/get-client-query.dto';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(dto: GetClientQueryDto) {
    const { search, page = 1, limit = 10 } = dto;

    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const where: any = {
      isDeleted: false,
    };

    // 🔍 Search (name + email)
    if (search) {
      where.OR = [
        { firstName: { contains: search.trim(), mode: 'insensitive' } },
        { lastName: { contains: search.trim(), mode: 'insensitive' } },
        { email: { contains: search.trim(), mode: 'insensitive' } },
      ];
    }

    const [clients, total] = await this.prisma.$transaction([
      this.prisma.client.findMany({
        where,
        orderBy: { firstName: 'asc' },
        skip,
        take: safeLimit,
      }),
      this.prisma.client.count({ where }),
    ]);

    return {
      data: clients,
      meta: {
        total,
        page: safePage,
        limit: safeLimit,
        totalPages: Math.ceil(total / safeLimit),
      },
    };
  }

  async findOne(id: string) {
    return this.prisma.client.findUniqueOrThrow({
      where: { id, isDeleted: false },
    });
  }


  async create(dto: CreateClientDto) {
    const clientExists = await this.prisma.client.findFirst({
      where: { email: dto.email }
    });

    if (clientExists) {
      throw new BadRequestException('This client\'s email already exists')
    }

    const client = await this.prisma.client.create({
      data: dto,
    })

    return {
      client,
      success: true,
      message: 'Client created successfully',
    }
  }

  async delete(id: string) {
    await this.prisma.client.update({
      where: { id },
      data: { isDeleted: true },
    })
  }

}
