import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  Query,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import type { PaginationQueryType } from 'src/types/util.types';
import type { UpdateUserDTO } from './dto/user.dto';
import { ZodValidationPipe } from 'src/pipes/zod-validation.pipe';
import { updateUserValidationSchema } from './util/user.validation.schema';
import { paginationSchema } from 'src/utils/api.util';

@ApiTags('Users')
@ApiBearerAuth('access_token')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users with pagination' })
  @ApiResponse({ status: 200, description: 'Users retrieved successfully' })
  findAll(
    @Query(new ZodValidationPipe(paginationSchema))
    query: PaginationQueryType,
  ) {
    return this.userService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'User retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: bigint) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user details' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        email: { type: 'string', format: 'email' }
      }
    }
  })
  update(
    @Param('id') id: bigint,
    @Body(new ZodValidationPipe(updateUserValidationSchema))
    userUpdatePayload: UpdateUserDTO,
  ) {
    return this.userService.update(id, userUpdatePayload);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: bigint) {
    const removedUser = await this.userService.remove(id);
    return Boolean(removedUser);
  }
}
