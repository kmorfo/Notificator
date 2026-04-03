import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsModule } from '../applications/applications.module';
import { AuthModule } from '../auth/auth.module';
import { Channel } from './entities/channel.entity';
import { ChannelsController } from './channels.controller';
import { ChannelsService } from './channels.service';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService],
  imports: [
    TypeOrmModule.forFeature([Channel]),
    forwardRef(() => ApplicationsModule),
    AuthModule,
    CommonModule,
    UsersModule,
  ],
  exports: [ChannelsModule, ChannelsService]
})
export class ChannelsModule { }
