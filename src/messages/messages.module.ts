import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsModule } from 'src/applications/applications.module';
import { AuthModule } from 'src/auth/auth.module';
import { Message } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { UsersModule } from 'src/users/users.module';
import { ChannelsModule } from 'src/channels/channels.module';
import { CommonModule } from 'src/common/common.module';
import { ProjectsModule } from 'src/projects/projects.module';
import { DevicesModule } from 'src/devices/devices.module';
import { TasksModule } from 'src/tasks/tasks.module';


@Module({
  controllers: [MessagesController],
  providers: [MessagesService],
  imports: [
    TypeOrmModule.forFeature([Message]),
    ApplicationsModule,
    AuthModule,
    ChannelsModule,
    CommonModule,
    DevicesModule,
    ProjectsModule,
    UsersModule,
    forwardRef(() => TasksModule),
  ],
  exports: [MessagesModule, MessagesService]
})
export class MessagesModule { }
