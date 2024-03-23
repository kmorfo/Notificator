import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApplicationsModule } from './applications/applications.module';
import { AuthModule } from './auth/auth.module';
import { ChannelsModule } from './channels/channels.module';
import { DevicesModule } from './devices/devices.module';
import { MailModule } from './mail/mail.module';
import { MessagesModule } from './messages/messages.module';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ApplicationsModule,
    AppModule,
    AuthModule,
    ChannelsModule,
    DevicesModule,
    MailModule,
    MessagesModule,
    ProjectsModule,
    UsersModule,
    ],
  controllers: [],
  providers: [],
})
export class AppModule { }
