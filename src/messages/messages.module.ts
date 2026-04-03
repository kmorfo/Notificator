import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsModule } from '../applications/applications.module';
import { AuthModule } from '../auth/auth.module';
import { Message } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { UsersModule } from '../users/users.module';
import { ChannelsModule } from '../channels/channels.module';
import { CommonModule } from '../common/common.module';
import { ProjectsModule } from '../projects/projects.module';
import { DevicesModule } from '../devices/devices.module';
import { TasksModule } from '../tasks/tasks.module';


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
