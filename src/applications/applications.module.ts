import { Module } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApplicationsController } from './applications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { Application } from './entities/application.entity';

@Module({
  controllers: [ApplicationsController],
  providers: [ApplicationsService],
  imports: [TypeOrmModule.forFeature([Application]), AuthModule, UsersModule],
  exports: [ApplicationsModule,ApplicationsService]
})
export class ApplicationsModule { }
