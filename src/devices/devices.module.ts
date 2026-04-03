import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsModule } from '../applications/applications.module';
import { AuthModule } from '../auth/auth.module';
import { Device } from './entities/device.entity';
import { DevicesController } from './devices.controller';
import { DevicesService } from './devices.service';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';
import { ChannelsModule } from '../channels/channels.module';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
  imports: [
    TypeOrmModule.forFeature([Device]),
    ApplicationsModule,
    AuthModule,
    ChannelsModule,
    CommonModule,
    UsersModule
  ],
  exports: [DevicesModule, DevicesService]
})
export class DevicesModule { }
