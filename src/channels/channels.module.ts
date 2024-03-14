import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from './entities/channel.entity';

@Module({
  controllers: [ChannelsController],
  providers: [ChannelsService],
  imports: [TypeOrmModule.forFeature([Channel])],
  exports:[ChannelsModule]
})
export class ChannelsModule {}
