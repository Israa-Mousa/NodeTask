import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
  ParseIntPipe,
  UseFilters,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { ProductService } from './product.service';
import type {
  CreateProductDTO,
  ProductResponseDTO,
  UpdateProductDTO,
} from './types/product.dto';
import type { ProductQuery } from './types/product.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  productSchema,
  productValidationSchema,
  updateProductValidationSchema,
} from './util/proudct.validation.schema';
import { Roles } from 'src/decorators/roles.decorator';
import { ImageKitExceptionFilter } from 'src/exceptions/exception';
import { FileCleanupInterceptor } from '../file/cleanup-file.interceptor';

@ApiTags('Products')
@ApiBearerAuth('access_token')
@Controller('product')
@Roles(['MERCHANT'])
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product (Merchant only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        file: { type: 'string', format: 'binary' }
      },
      required: ['name','description','price']
    }
  })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Merchant role required' })
  @UseInterceptors(FileInterceptor('file'), FileCleanupInterceptor)
  @UseFilters(ImageKitExceptionFilter)
  create(
    @Body(new ZodValidationPipe(productValidationSchema))
    createProductDto: CreateProductDTO,
    @Req() request: Express.Request,
    @UploadedFile()
    file?: Express.Multer.File,
  ): Promise<ProductResponseDTO> {
    return this.productService.create(createProductDto, request.user, file);
  }

  @Roles(['MERCHANT', 'CUSTOMER'])
  @Get()
  @ApiOperation({ summary: 'Get all products with pagination' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  findAll(@Query(new ZodValidationPipe(productSchema)) query: ProductQuery) {
    return this.productService.findAll(query);
  }

  @Roles(['MERCHANT', 'CUSTOMER'])
  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product (Merchant only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        file: { type: 'string', format: 'binary' },
      },
      required: [],
    },
  })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @UseInterceptors(FileInterceptor('file'), FileCleanupInterceptor)
  @UseFilters(ImageKitExceptionFilter)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ZodValidationPipe(updateProductValidationSchema))
    updatePayload: UpdateProductDTO,
    @Req()
    request: Express.Request,
    @UploadedFile()
    file?: Express.Multer.File,
  ): Promise<ProductResponseDTO> {
    return this.productService.update(id, updatePayload, request.user, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product (Merchant only)' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Express.Request,
  ) {
    return this.productService.remove(id, request.user);
  }
}
