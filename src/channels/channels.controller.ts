import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { Auth } from 'src/auth/decorators';
import { Channel } from './entities/channel.entity';
import { ChannelsService } from './channels.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { NotAnotherChannelGuard } from 'src/applications/guards/not-another-channel.guard';
import { SameAppUserGuard } from './guards/same-app-user.guard';
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
  @ApiResponse({ status: 404, description: 'Not Found. Channel not found.' })
  create(
    @Body() createChannelDto: CreateChannelDto
  ) {
    return this.channelsService.create(createChannelDto);
  }

  @Get()
  findAll() {
    return this.channelsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.channelsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChannelDto: UpdateChannelDto) {
    return this.channelsService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.channelsService.remove(+id);
  }
}
