import { Module, forwardRef } from '@nestjs/common';

import { ApplicationsModule } from 'src/applications/applications.module';
import { AuthModule } from 'src/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { MessagesModule } from 'src/messages/messages.module';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [
    AuthModule,
    CommonModule,
    ApplicationsModule,
    forwardRef(() => MessagesModule),
  ],
  exports: [TasksModule, TasksService]
})
export class TasksModule { }
