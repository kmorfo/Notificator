import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as cron from 'node-cron';
import * as firebase from 'firebase-admin';

import { ChannelsService } from 'src/channels/channels.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { ErrorHandlingService } from 'src/common/error-handling/error-handling.service';
import { FilterMessageDto } from './dto/filter-message.dto';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';
import { ProjectsService } from '../projects/projects.service';
import { Channel } from 'src/channels/entities/channel.entity';
import { DevicesService } from 'src/devices/devices.service';


@Injectable()
export class MessagesService {
  private readonly logger = new Logger('MessagesService');
  private firebaseApp: firebase.app.App | null = null;

  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly channelsService: ChannelsService,
    private readonly devicesService: DevicesService,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly projectsService: ProjectsService,
  ) { }

  async create(createMessageDto: CreateMessageDto, user: User): Promise<Message | undefined | String> {
    await this.initializeFirebaseApp(user);
    const { applicationId, channel, ...messageData } = createMessageDto;

    let channelMsg: Channel = await this.channelsService.findOneByNameApp(channel, applicationId);

    const tokens = await this.devicesService.getAllDeviceTokenBy(channelMsg.name, applicationId);

    if (tokens.length <= 0)
      throw new NotFoundException(`The application with id ${applicationId} does not have devices registered`);

    if (!createMessageDto.time)
      return await this.createMessage(createMessageDto, channelMsg, user, tokens)
    else
      return await this.scheduleTask(createMessageDto, channelMsg, user, tokens)
  }

  async createTest(createMessageDto: CreateMessageDto, user: User, token: string): Promise<Message | undefined | String> {
    await this.initializeFirebaseApp(user);
    const { applicationId, channel, ...messageData } = createMessageDto;

    let channelMsg: Channel = await this.channelsService.findOneByNameApp(channel, applicationId);

    const tokens = [token];

    if (tokens.length <= 0)
      throw new NotFoundException(`The application with id ${applicationId} does not have devices registered`);

    if (!createMessageDto.time)
      return await this.createMessage(createMessageDto, channelMsg, user, tokens)
    else
      return await this.scheduleTask(createMessageDto, channelMsg, user, tokens)
  }


  private scheduleTask(createMessageDto, channelMsg, user, tokens): String {
    let cronPattern = '';

    if (createMessageDto.time) {
      const [hour, minute] = createMessageDto.time.split(':');
      cronPattern += `${minute || '*'} ${hour || '*'} * * *`;
    }

    if (createMessageDto.date) {
      const [day, month, year] = createMessageDto.date.split('/');
      cronPattern = `0 0 ${day} ${month} * ${year}`;
    }

    cron.schedule(cronPattern, () => {
      this.createMessage(createMessageDto, channelMsg, user, tokens)
    });
    return "The message was scheduled correctly"
  }

  private async createMessage(createMessageDto: CreateMessageDto, channelMsg: Channel, user: User, tokens: string[]): Promise<Message | undefined> {
    const { applicationId, channel, ...messageData } = createMessageDto;

    try {
      let message = await this.messagesRepository.create(messageData);

      message.channel = channelMsg;
      message.application = channelMsg.application;
      message.user = user;

      message = await this.messagesRepository.save(message);

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
    if (project.secretkeyfile == "") throw new NotFoundException(`Project ${project.name} doesn't have a Secret Key File.`);

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
