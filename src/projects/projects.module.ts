import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CommonModule } from '../common/common.module';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService],
  imports: [
    TypeOrmModule.forFeature([Project]),
    AuthModule,
    CommonModule,
    UsersModule
  ],
  exports: [ProjectsModule, ProjectsService]
})
export class ProjectsModule { }
