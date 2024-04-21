import { Controller, Get, Post, Body, UseGuards, Query, Param, Delete } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Auth, GetUser } from 'src/auth/decorators';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessageDto } from './dto/filter-message.dto';
import { Message } from './entities/message.entity';
import { MessagesService } from './messages.service';
import { SameAppUserGuard } from 'src/common/guards/same-app-user.guard';
import { User } from 'src/users/entities/user.entity';

export class ApiResponseUnion {
  message?: Message;
  stringMessage?: string;
}

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) { }

  @Post()
  @Auth()
  @UseGuards(AuthGuard(), SameAppUserGuard)
  @ApiResponse({ status: 201, description: 'Message was created', type: ApiResponseUnion })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, Token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found. Application not found or project doesnt have Secret Key File.' })
  create(
    @Body() createMessageDto: CreateMessageDto,
    @GetUser() user: User
  ) {
    return this.messagesService.create(createMessageDto, user);
  }


  @Post(':token')
  @Auth()
  @UseGuards(AuthGuard(), SameAppUserGuard)
  @ApiResponse({ status: 201, description: 'Message was created', type: ApiResponseUnion })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, Token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found. Application not found or project doesnt have Secret Key File.' })
  createTest(
    @Body() createMessageDto: CreateMessageDto,
    @GetUser() user: User,
    @Param('token') token: string
  ) {
    return this.messagesService.createTest(createMessageDto, user, token);
  }

  @Get()
  @Auth()
  @UseGuards(AuthGuard(), SameAppUserGuard)
  @ApiResponse({ status: 200, description: 'Returns array of Messages filtered', type: Array<Message> })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found. No messages found with these params.' })
  findOne(@Query() filterMessageDto: FilterMessageDto) {
    return this.messagesService.findBy(filterMessageDto);
  }
}
