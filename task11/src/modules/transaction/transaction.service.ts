import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { PaginatedResult, PaginationQueryType } from 'src/types/util.types';
import { removeFields } from 'src/utils/object.util';
import { Prisma } from 'generated/prisma';

@Injectable()
export class TransactionService {
  constructor(private readonly prismaService: DatabaseService) {}

  async findAll(
    userId: bigint,
    query: PaginationQueryType & {
      sortBy?: 'createdAt' | 'id';
      fields?: string;
    },
  ): Promise<PaginatedResult<any>> {
    return this.prismaService.$transaction(async (prisma) => {
      const pagination = this.prismaService.handleQueryPagination(query);
      
      // Handle sorting
      const sortBy = query.sortBy || 'createdAt';
      const orderBy: Prisma.UserTransactionOrderByWithRelationInput = 
        sortBy === 'id' 
          ? { id: 'desc' }
          : { createdAt: 'desc' };

      // Handle field selection
      const selectFields = query.fields
        ? this.parseFields(query.fields)
        : undefined;

      const transactions = await prisma.userTransaction.findMany({
        ...removeFields(pagination, ['page']),
        where: { userId },
        orderBy,
        select: selectFields || {
          id: true,
          amount: true,
          type: true,
          createdAt: true,
          paymentMethod: true,
          order: {
            select: {
              id: true,
              orderStatus: true,
            },
          },
          orderReturn: {
            select: {
              id: true,
              status: true,
            },
          },
        },
      });

      const count = await prisma.userTransaction.count({
        where: { userId },
      });

      return {
        data: transactions,
        ...this.prismaService.formatPaginationResponse({
          page: pagination.page,
          count,
          limit: pagination.take,
        }),
      };
    });
  }

  private parseFields(fields: string): Record<string, any> {
    const fieldArray = fields.split(',').map((f) => f.trim());
    const select: Record<string, any> = {};
    
    for (const field of fieldArray) {
      if (field.includes('.')) {
        // Handle nested fields like "order.id"
        const [relation, relationField] = field.split('.');
        if (!select[relation]) {
          select[relation] = { select: {} };
        }
        select[relation].select[relationField] = true;
      } else {
        select[field] = true;
        // Always include id for identification
        if (field !== 'id') {
          select.id = true;
        }
      }
    }
    
    return select;
  }
}

