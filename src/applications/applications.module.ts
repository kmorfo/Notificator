import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Application } from './entities/application.entity';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';
import { UsersModule } from '../users/users.module';
import { ChannelsModule } from '../channels/channels.module';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  imports: [
    TypeOrmModule.forFeature([Application]),
    forwardRef(() => ChannelsModule),
    AuthModule,
    CommonModule,
    ProjectsModule,
    UsersModule,
  ],
  exports: [ApplicationsModule, ApplicationsService]
})
export class ApplicationsModule { }
