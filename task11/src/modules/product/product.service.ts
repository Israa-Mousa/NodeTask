import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ProductQuery } from './types/product.types';
import { Prisma } from 'generated/prisma';
import type { CreateProductDTO, UpdateProductDTO } from './types/product.dto';
import { FileService } from '../file/file.service';
import { SideEffectQueue } from 'src/utils/side-effects';
import { removeFields } from 'src/utils/object.util';

@Injectable()
export class ProductService {
  constructor(
    private prismaService: DatabaseService,
    private fileService: FileService,
  ) {}
  create(
    createProductDto: CreateProductDTO,
    user: Express.Request['user'],
    file?: Express.Multer.File,
  ) {
    const dataPayload: Prisma.ProductUncheckedCreateInput = {
      ...createProductDto,
      merchantId: Number(user!.id),
    };

    if (file) {
      dataPayload.Asset = {
        create: this.fileService.createFileAssetData(file, Number(user!.id)),
      };
    }

    return this.prismaService.product.create({
      data: dataPayload,
      include: { Asset: true },
    });
  }

  findAll(query: ProductQuery & { sortBy?: 'createdAt' | 'id'; fields?: string }) {
    return this.prismaService.$transaction(async (prisma) => {
      const whereClause: Prisma.ProductWhereInput = query.name
        ? { name: { contains: query.name } }
        : {};
      const pagination = this.prismaService.handleQueryPagination(query);
      
      // Handle sorting
      const sortBy = query.sortBy || 'id';
      const orderBy = { id: 'desc' as const };

      // Handle field selection
      const selectFields = query.fields
        ? this.parseFields(query.fields)
        : undefined;

      const products = await prisma.product.findMany({
        ...removeFields(pagination, ['page']),
        where: whereClause,
        orderBy: orderBy as any,
        ...(selectFields ? { select: selectFields } : {}),
      });
      const count = await prisma.product.count({
        where: whereClause,
      });
      return {
        data: products,
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
        // Handle nested fields like "Asset.url"
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

  findOne(id: number) {
    return this.prismaService.product.findUnique({
      where: { id },
      include: { Asset: true },
    });
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDTO,
    user: Express.Request['user'],
    file?: Express.Multer.File,
  ) {
    // get instance side effects queue
    const sideEffects = new SideEffectQueue();

    // run prisma transaction { invoke fileservice.deleteFile (prismaTX,productId,user,sideEffect) , prisma update product  }
    const updatedProduct = await this.prismaService.$transaction(
      async (prismaTX) => {
        if (file) {
          await this.fileService.deleteProductAsset(
            prismaTX,
            id,
            Number(user!.id),
            sideEffects,
          );
        }

        const dataPayload: Prisma.ProductUncheckedUpdateInput = {
          ...updateProductDto,
        };
        if (file) {
          dataPayload.Asset = {
            create: this.fileService.createFileAssetData(
              file,
              Number(user!.id),
            ),
          };
        }
        // order is important here
        return await prismaTX.product.update({
          where: { id, merchantId: Number(user!.id) },
          data: dataPayload,
          include: { Asset: true },
        });
      },
    );

    await sideEffects.runAll();
    return updatedProduct;
  }

  remove(id: number, user: Express.Request['user']) {
    return this.prismaService.product.update({
      where: { id, merchantId: Number(user!.id) },
      data: { isDeleted: true },
    });
  }
}
