import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

@Injectable()
export class MessagesService {
  private readonly logger = new Logger('MessagesService');

  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly channelsService: ChannelsService,
    private readonly applicationsService: ApplicationsService,
    private readonly projectsService: ProjectsService,
    private readonly errorHandlingService: ErrorHandlingService,
  ) { }

  async create(createMessageDto: CreateMessageDto, user: User): Promise<Message | undefined> {
    await this.initializeApp(user);

    try {
      const { applicationId, channel, ...messageData } = createMessageDto;

      let channelMsg = await this.channelsService.findOneByNameApp(channel, applicationId);
      let message = await this.messagesRepository.create(messageData);

      console.log(channelMsg)

      message.channel = channelMsg;
      message.application = channelMsg.application;
      message.user = user;

      message = await this.messagesRepository.save(message);
      message.application = null
      message.channel = null
      message.user = null

      return message
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async initializeApp(user: User) {
    const project = await this.projectsService.findOneByUser(user);
    if (!project) throw new NotFoundException(`No project found for user ${user.username}.`);
    if (project.secretkeyfile == "") throw new NotFoundException(`Project ${project.name} doesn't have Secret Key File.`);

    await firebase.initializeApp({
      credential: firebase.credential.cert(`./static/projects/${project.secretkeyfile}`)
    });

    this.logger.log(`Firebase initilized with ./static/projects/${project.secretkeyfile} file`)
  }

  private async sendMessage(message: Message, application: Application) {

    const registrationTokens = [
      'fSSzm7MRQcW4BxYDoEd5RH:APA91bFTjWZ0dtIlsYhcYjIYrpcaYfnq-z5UkCUU0R2z8u2PDRUp1r_USoqavofwzs9mEvGuil7oesOpLEZhuPLWTgJrNHwffIxySUQZEx91WsVysBKo6GKmBDViIgoU0kgzAbMcpkyb'
    ];

    const notification = {
      title: 'Price drop',
      body: '5% off all electronics',
      data: {
        score: '850', time: '2:45'
      },
      tokens: registrationTokens,
    };

    await firebase.messaging().sendEachForMulticast(notification)



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
