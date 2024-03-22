import { BadRequestException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ApplicationsService } from 'src/applications/applications.service';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ErrorHandlingService } from 'src/common/error-handling/error-handling.service';


@Injectable()
export class ChannelsService {
  private readonly logger = new Logger('ChannelService');

  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
    private readonly errorHandlingService: ErrorHandlingService,
    @Inject(forwardRef(() => ApplicationsService))
    private readonly applicationsService: ApplicationsService
  ) { }


  async create(createChannelDto: CreateChannelDto) {
    try {
      const { name, applicationId } = createChannelDto;
      const application = await this.applicationsService.findOneByAppId(applicationId);

      let channel = await this.channelsRepository.create({ name: name, application: application });
      channel = await this.channelsRepository.save(channel);

      return {
        id: channel.id,
        name: channel.name,
        application: applicationId
      };
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async findAllChannelsOfApp(term: string): Promise<Channel[]> {
    return await this.channelsRepository
      .createQueryBuilder('channel')
      .select(['channel.id', 'channel.name'])
      .innerJoin('channel.application', 'application')
      .where('application.applicationId = :applicationId', { applicationId: term })
      .andWhere('channel.isActive = true')
      .getMany();
  }

  async findOneByNameApp(name = "default", applicationID: string): Promise<Channel | undefined> {

    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoinAndSelect('channel.application', 'application')
      .where('channel.name = :name', { name: name })
      .andWhere('application.applicationId = :applicationId', { applicationId: applicationID })
      .getOne();

    return channel;
  }

  async findOne(id: string): Promise<Channel | undefined> {
    const channel = await this.channelsRepository.findOne({ where: { id: id } })

    if (!channel)
      throw new NotFoundException(`Channel with ${id} not found`);

    return channel;
  }


  async update(id: string, updateChannelDto: UpdateChannelDto): Promise<Channel | undefined> {
    const channel = await this.findOne(id);

    if (!updateChannelDto.name || updateChannelDto.name != undefined) {
      const otherChannel = await this.findOneByNameApp(updateChannelDto.name, updateChannelDto.applicationId)
      if (otherChannel && otherChannel.name != channel.name)
        throw new BadRequestException(`Channel ${otherChannel.name} is already registered for this app`)
    }

    try {
      const channelUpdated = await this.channelsRepository.preload({ id: id, ...updateChannelDto })

      return await this.channelsRepository.save(channelUpdated);
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async remove(id: string): Promise<string | undefined> {
    const channel = await this.findOne(id)

    channel.isActive = false;
    this.channelsRepository.save(channel)

    return `Channel with id ${id} was disabled`;
  }
}
