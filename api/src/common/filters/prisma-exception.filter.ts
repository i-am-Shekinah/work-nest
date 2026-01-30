import { Prisma } from 'generated/prisma/client';

import { ArgumentsHost, Injectable } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Injectable()
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(
    exception: Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const fields = Array.isArray(exception.meta?.target)
      ? exception.meta.target.join(', ')
      : exception.meta?.target;

    switch (exception.code) {
      case 'P2002':
        response.status(409).json({
          statusCode: 409,
          error: 'Conflict',
          message: `Unique constraint failed on the fields: ${fields}`,
        });
        break;

      case 'P2003':
        response.status(409).json({
          statusCode: 409,
          error: 'Conflict',
          message: `Foreign key constraint failed on the fields: ${fields}`,
        });
        break;

      case 'P2025':
        response.status(404).json({
          statusCoe: 404,
          error: 'Not Found',
          message: `Record not found: ${fields}`,
        });
        break;

      default:
        super.catch(exception, host);
        break;
    }
  }
}
