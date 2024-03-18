import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AppAllowedGuard } from './guards/app-allowed.guard';
import { Auth } from 'src/auth/decorators';
import { CreateDeviceDto } from './dto/create-device.dto';
import { Device } from './entities/device.entity';
import { DevicesService } from './devices.service';
import { SameAppGuard } from './guards/same-app.guard';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Devices')
@Controller('devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) { }

  @Post()
  @UseGuards(AppAllowedGuard)
  @ApiResponse({ status: 201, description: 'Device was created', type: Device })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden. Non valid SHA sign' })
  @ApiResponse({ status: 404, description: 'Not Found. ApplicationID not found' })
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.devicesService.create(createDeviceDto);
  }


  @Get(':term')
  @Auth()
  @ApiResponse({ status: 201, description: 'Device data with applicationID' })
  @ApiResponse({ status: 401, description: 'Unauthorized, Token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found. Device token not found' })
  @UseGuards(AuthGuard(), SameAppGuard)
  findOne(@Param('term') term: string) {
    return this.devicesService.findOne(term);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @UseGuards(AuthGuard(), SameAppGuard)
  @ApiResponse({ status: 200, description: 'Returns a device object', type: Device })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDeviceDto: UpdateDeviceDto
  ) {
    return this.devicesService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @UseGuards(AuthGuard(), SameAppGuard)
  @ApiResponse({ status: 200, description: 'Device was disabled' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.devicesService.remove(id);
  }
}
