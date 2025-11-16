import { Controller, Get, Query, Req } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { paginationSchema } from 'src/utils/api.util';
import { z } from 'zod';
import type { PaginationQueryType } from 'src/types/util.types';

const transactionQuerySchema = paginationSchema.extend({
  sortBy: z.enum(['createdAt', 'id']).optional(),
  fields: z.string().optional(),
});

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
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

