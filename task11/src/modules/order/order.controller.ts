import { Controller, Get, Post, Body, Param, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { Roles } from 'src/decorators/roles.decorator';
import type {
  CreateOrderDTO,
  CreateOrderResponseDTO,
  CreateOrderReturnDTO,
  OrderOverviewResponseDTO,
  OrderResponseDTO,
} from './types/order.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import {
  createOrderDTOValidationSchema,
  createReturnDTOValidationSchema,
  updateOrderStatusValidationSchema,
  updateReturnStatusValidationSchema,
} from './util/order.validation.schema';
import { paginationSchema } from 'src/utils/api.util';
import type {
  PaginatedResult,
  PaginationQueryType,
} from 'src/types/util.types';
import { User } from 'src/decorators/user.decorator';
import { UserResponseDTO } from '../auth/dto/auth.dto';

@ApiTags('Orders')
@ApiBearerAuth('access_token')
@Controller('order')
@Roles(['CUSTOMER'])
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiBody({
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          productId: { type: 'number' },
          qty: { type: 'number' }
        },
        required: ['productId','qty']
      }
    }
  })
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid order data' })
  create(
    @Body(new ZodValidationPipe(createOrderDTOValidationSchema))
    createOrderDto: CreateOrderDTO,

    @User() user: UserResponseDTO['user'],
  ): Promise<CreateOrderResponseDTO> {
    return this.orderService.create(createOrderDto, BigInt(user.id));
  }

  @Get()
  @ApiOperation({ summary: 'Get all user orders with pagination' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  findAll(
    @Req() request: Express.Request,

    @Query(new ZodValidationPipe(paginationSchema))
    query: PaginationQueryType,
  ): Promise<PaginatedResult<OrderOverviewResponseDTO>> {
    return this.orderService.findAll(BigInt(request.user!.id), query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details by ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Order not found' })
  findOne(
    @Param('id') id: string,
    @Req() request: Express.Request,
  ): Promise<OrderResponseDTO> {
    return this.orderService.findOne(+id, BigInt(request.user!.id));
  }

  // returns end points

  // create return
  @Post('return')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        orderId: { type: 'number' },
        items: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              productId: { type: 'number' },
              qty: { type: 'number' }
            },
            required: ['productId','qty']
          }
        }
      },
      required: ['orderId','items']
    }
  })
  @ApiOperation({ summary: 'Create a return request for an order' })
  @ApiResponse({ status: 201, description: 'Return request created' })
  @ApiResponse({ status: 400, description: 'Invalid return data' })
  createReturn(
    @Body(new ZodValidationPipe(createReturnDTOValidationSchema))
    createReturnDto: CreateOrderReturnDTO,
    @Req() request: Express.Request,
  ): Promise<OrderResponseDTO> {
    return this.orderService.createReturn(
      createReturnDto,
      BigInt(request.user!.id),
    );
  }

  // Admin routes
  @Roles(['ADMIN'])
  @Post(':id/status')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { status: { type: 'string', enum: ['PENDING','SUCCESS'] } },
      required: ['status']
    }
  })
  @ApiOperation({ summary: 'Update order status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Order status updated' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  updateOrderStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateOrderStatusValidationSchema))
    body: { status: 'PENDING' | 'SUCCESS' },
  ) {
    return this.orderService.updateOrderStatus(+id, body.status);
  }

  @Roles(['ADMIN'])
  @Post('return/:returnId/status')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { status: { type: 'string', enum: ['PENDING','PICKED','REFUND'] } },
      required: ['status']
    }
  })
  @ApiOperation({ summary: 'Update return status (Admin only)' })
  @ApiResponse({ status: 200, description: 'Return status updated' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  updateReturnStatus(
    @Param('returnId') returnId: string,
    @Body(new ZodValidationPipe(updateReturnStatusValidationSchema))
    body: { status: 'PENDING' | 'PICKED' | 'REFUND' },
  ) {
    return this.orderService.updateReturnStatus(+returnId, body.status);
  }
}
