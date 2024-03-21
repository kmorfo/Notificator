import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ApplicationsService } from 'src/applications/applications.service';
import { ChannelsService } from 'src/channels/channels.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { FilterMessageDto } from './dto/filter-message.dto';
import { Message } from './entities/message.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MessagesService {
  private readonly logger = new Logger('MessagesService');

  constructor(
    @InjectRepository(Message)
    private readonly messagesRepository: Repository<Message>,
    private readonly channelsService: ChannelsService
  ) { }

  async create(createMessageDto: CreateMessageDto, user: User): Promise<Message | undefined> {
    try {
      const { applicationId, channel, ...messageData } = createMessageDto;

      let channelMsg = await this.channelsService.findOneByNameApp(channel, applicationId);
      let message = await this.messagesRepository.create(messageData);

      message.channel = channelMsg;
      message.application = channelMsg.application;
      message.user = user;

      message = await this.messagesRepository.save(message);
      message.application = null
      message.channel = null
      message.user = null

      return message
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async findOne(filterMessageDto: FilterMessageDto): Promise<Message[]> {
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


  private handleDBExceptions(error: any): never {
    console.log(error);
    this.logger.error(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
