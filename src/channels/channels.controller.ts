import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Auth, GetUser } from 'src/auth/decorators';
import { Channel } from './entities/channel.entity';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { NotAnotherChannelGuard } from 'src/applications/guards/not-another-channel.guard';
import { SameAppUserGuard } from '../common/guards/same-app-user.guard';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ValidRoles } from 'src/auth/interfaces';


@ApiTags('Channels')
@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelsService: ChannelsService) { }

  @Post()
  @Auth(ValidRoles.admin)
  @UseGuards(AuthGuard(), SameAppUserGuard, NotAnotherChannelGuard)
  @ApiResponse({ status: 201, description: 'Channel was created', type: Channel })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, Token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found. Application not found.' })
  create(
    @Body() createChannelDto: CreateChannelDto
  ) {
    return this.channelsService.create(createChannelDto);
  }

  // @Get()
  // findAll() {
  //   return this.channelsService.findAll();
  // }

  @Get(':term')
  @Auth(ValidRoles.admin)
  @UseGuards(AuthGuard(), SameAppUserGuard)
  @ApiResponse({ status: 200, description: 'Returns array of Channels', type: Array<Channel> })
  @ApiResponse({ status: 401, description: 'Unauthorized, Token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found. Application not found.' })
  findAllChannelsOfApp(
    @Param('term') term: string
  ) {
    return this.channelsService.findAllChannelsOfApp(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @UseGuards(AuthGuard(), SameAppUserGuard)
  @ApiResponse({ status: 200, description: 'Returns an channel object', type: Channel })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateChannelDto: UpdateChannelDto
  ) {
    return this.channelsService.update(id, updateChannelDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @UseGuards(AuthGuard(), SameAppUserGuard)
  @ApiResponse({ status: 200, description: 'Channel was disabled' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.channelsService.remove(id);
  }
}
