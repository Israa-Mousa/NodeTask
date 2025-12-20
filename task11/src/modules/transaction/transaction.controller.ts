import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { paginationSchema } from 'src/utils/api.util';
import { z } from 'zod';
import type { PaginationQueryType } from 'src/types/util.types';

const transactionQuerySchema = paginationSchema.extend({
  sortBy: z.enum(['createdAt', 'id']).optional(),
  fields: z.string().optional(),
});

@ApiTags('Transactions')
@ApiBearerAuth('access_token')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: 'Get user transactions with pagination' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved successfully' })
  findAll(
    @Req() request: Express.Request,
    @Query(new ZodValidationPipe(transactionQuerySchema))
    query: PaginationQueryType & {
      sortBy?: 'createdAt' | 'id';
      fields?: string;
    },
  ) {
    return this.transactionService.findAll(
      BigInt(request.user!.id),
      query,
    );
  }
}

