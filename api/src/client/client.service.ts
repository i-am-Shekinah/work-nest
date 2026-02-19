import { PrismaService } from 'src/prisma/prisma.service';

import { Injectable } from '@nestjs/common';

import { GetClientQueryDto } from './dto/get-client-query.dto';

@Injectable()
export class ClientService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: GetClientQueryDto) {
    const { search, page = 1, limit = 10 } = dto;

    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const skip = (safePage - 1) * safeLimit;

    const where: any = {
      isDeleted: false,
    };
  }

  async findOne(id: string) {}
}
