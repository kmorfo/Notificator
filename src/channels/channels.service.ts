import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { ApplicationsService } from 'src/applications/applications.service';
import { Channel } from './entities/channel.entity';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { User } from 'src/users/entities/user.entity';
import { Application } from 'src/applications/entities/application.entity';

@Injectable()
export class ChannelsService {
  private readonly logger = new Logger('ChannelService');

  constructor(
    @InjectRepository(Channel)
    private readonly channelsRepository: Repository<Channel>,
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
      this.handleDBExceptions(error);
    }
  }

  findAll() {
    return `This action returns all channels`;
  }

  findOne(term: number) {
    return `This action returns a #${term} channel`;
  }

  async findOneByNameApp(name: string, applicationID: string): Promise<Channel | undefined> {
    const channel = await this.channelsRepository
      .createQueryBuilder('channel')
      .innerJoinAndSelect('channel.application', 'application')
      .where('channel.name = :name', { name: name })
      .andWhere('application.applicationId = :applicationId', { applicationId: applicationID })
      .getOne();

    return channel;
  }



  update(id: number, updateChannelDto: UpdateChannelDto) {
    return `This action updates a #${id} channel`;
  }

  remove(id: number) {
    return `This action removes a #${id} channel`;
  }

  private handleDBExceptions(error: any): never {
    console.log(error);
    this.logger.error(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
