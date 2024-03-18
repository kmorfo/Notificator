import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsModule } from 'src/applications/applications.module';
import { AuthModule } from 'src/auth/auth.module';
import { Channel } from './entities/channel.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService],
  imports: [TypeOrmModule.forFeature([Channel]), AuthModule, UsersModule, ApplicationsModule],
  exports: [ChannelsModule]
})
export class ChannelsModule { }
