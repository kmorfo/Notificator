import { Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as firebase from 'firebase-admin';
import * as path from 'path';

import { ChannelsService } from 'src/channels/channels.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ErrorHandlingService } from 'src/common/error-handling/error-handling.service';
import { FilterMessageDto } from './dto/filter-message.dto';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { Application } from 'src/applications/entities/application.entity';
import { ApplicationsService } from '../applications/applications.service';
import { Channel } from 'src/channels/entities/channel.entity';
import { DevicesService } from 'src/devices/devices.service';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger('MessagesService');
  private firebaseApp: firebase.app.App | null = null;

  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    // private readonly applicationsService: ApplicationsService,
    private readonly channelsService: ChannelsService,
    private readonly devicesService: DevicesService,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly projectsService: ProjectsService,
  ) { }

  async create(createMessageDto: CreateMessageDto, user: User): Promise<Message | undefined> {
    await this.initializeFirebaseApp(user);

    try {
      const { applicationId, channel, ...messageData } = createMessageDto;

      let channelMsg = await this.channelsService.findOneByNameApp(channel, applicationId);
      let message = await this.messagesRepository.create(messageData);

      message.channel = channelMsg;
      message.application = channelMsg.application;
      message.user = user;

      message = await this.messagesRepository.save(message);
      const tokens = await this.devicesService.getAllDeviceTokenBy(channelMsg.name, applicationId);

      this.sendMessage(message, tokens);

      message.application = null;
      message.channel = null;
      message.user = null;

      return message
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async initializeFirebaseApp(user: User) {
    const project = await this.projectsService.findOneByUser(user);
    if (!project) throw new NotFoundException(`No project found for user ${user.username}.`);
    if (project.secretkeyfile == "") throw new NotFoundException(`Project ${project.name} doesn't have Secret Key File.`);

    if (!this.firebaseApp) {
      this.firebaseApp = await firebase.initializeApp({
        credential: firebase.credential.cert(`./static/projects/${project.secretkeyfile}`)
      });
    }

    this.logger.log(`Firebase initilized with ./static/projects/${project.secretkeyfile} file`);
  }

  private async sendMessage(message: Message, tokens: string[]) {
    //Setting notification with optional params
    const notificationMessage: firebase.messaging.NotificationMessagePayload = {
      title: message.title,
      body: message.body
    };

    if (message.image) notificationMessage.imageUrl = message.image

    const fireMessage: any = {
      notification: notificationMessage,
      topic: message.channel.name,
      tokens: tokens
    }

    if (message.data) fireMessage.data = message.data;

    //send notification to all devices of this channel
    await this.firebaseApp.messaging().sendEachForMulticast(fireMessage)
      .then((response) => {
        this.logger.log(`${response.successCount} messages were sent successfully`)
      }).catch((error) => {
        this.logger.error(`Error sending message:', ${error}`)
      });

    //When the message has been sent, the connection firebaseApp is closed
    if (this.firebaseApp) {
      await this.firebaseApp.delete();
      this.firebaseApp = null;
    }
  }

  async findBy(filterMessageDto: FilterMessageDto): Promise<Message[]> {
    const date = new Date();
    const {
      applicationId,
      channel = "default",
      from = new Date(date.getFullYear(), date.getMonth(), 1),
      to = date
    } = filterMessageDto;

    const messages = await this.messagesRepository
      .createQueryBuilder('messages')
      .innerJoin('messages.application', 'application')
      .innerJoin('messages.channel', 'channel')
      .where('application.applicationId = :applicationId', { applicationId: applicationId })
      .andWhere('channel.name = :channel', { channel })
      .andWhere('messages.created_at >= :from', { from })
      .andWhere('messages.created_at <= :to', { to })
      .getMany()

    if (messages.length == 0)
      throw new NotFoundException(`No messages found with these params.`);

    return messages
  }

}
