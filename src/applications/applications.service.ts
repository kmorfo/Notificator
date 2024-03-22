import { ForbiddenException, Inject, Injectable, Logger, NotFoundException, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { Application } from './entities/application.entity';
import { ChannelsService } from 'src/channels/channels.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { ProjectsService } from 'src/projects/projects.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateChannelDto } from 'src/channels/dto/create-channel.dto';
import { ErrorHandlingService } from 'src/common/error-handling/error-handling.service';

@Injectable()
export class ApplicationsService {
  private readonly logger = new Logger('ApplicationsService');

  constructor(
    @InjectRepository(Application)
    private readonly applicationsRepository: Repository<Application>,
    private readonly projectService: ProjectsService,
    private readonly errorHandlingService: ErrorHandlingService,
    @Inject(forwardRef(() => ChannelsService))
    private readonly channelsService: ChannelsService
  ) { }

  async create(createApplicationDto: CreateApplicationDto, user: User): Promise<Application | undefined> {
    try {
      const { projectUID, ...applicationData } = createApplicationDto;

      let application = await this.applicationsRepository.create(applicationData);
      application.users = [user]

      const project = await this.projectService.findOne(projectUID, user)
      if (!project) throw new NotFoundException(`Project with UID ${projectUID} not found.`)

      application.project = project;

      application = await this.applicationsRepository.save(application);

      //creates default channel
      const createChannelDTO = new CreateChannelDto()
      createChannelDTO.applicationId = application.applicationId
      createChannelDTO.name = "default"
      await this.channelsService.create(createChannelDTO)

      application.users = []

      return application;
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User): Promise<Application[]> {
    try {
      const { limit = 10, offset = 0, isActive = true } = paginationDto;
      return await this.applicationsRepository.find({
        // relations: { users: true }, //If you want to show user data, discomment this line
        where: { users: user, isActive: isActive },
        take: limit,
        skip: offset
      })
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async findOne(term: string, user: User): Promise<Application | undefined> {
    const condition = isUUID(term) ? { id: term, users: user } : { applicationId: term, users: user };

    let application: Application = await this.applicationsRepository.findOne({ where: condition })

    if (!application) throw new NotFoundException(`Application with ${term} not found`);
    return application;
  }

  async findOneByAppId(applicationId: string): Promise<Application | undefined> {
    let application: Application = await this.applicationsRepository
      .findOne({ where: { applicationId: applicationId, isActive: true } })

    if (!application) throw new NotFoundException(`Application with ${applicationId} not found`);
    return application;
  }

  async checkUserApp(applicationId: string, user: User): Promise<Application | undefined> {
    let application = await this.applicationsRepository
      .findOne({ where: { applicationId: applicationId, users: user } })

    if (!application) throw new ForbiddenException(`User cant access to ${applicationId} application`);

    return application;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto, user: User): Promise<Application | undefined> {
    const application = await this.findOne(id, user);

    try {
      await this.applicationsRepository
        .createQueryBuilder()
        .update(application)
        .set({ ...updateApplicationDto })
        .where({ id: id })
        .execute();

      //Returned application with new data     
      return await this.findOne(id, user);
    } catch (error) {
      this.errorHandlingService.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User): Promise<string | undefined> {
    //I dont delete the application, only set isActive to false
    const application = await this.findOne(id, user);
    application.isActive = false;
    this.applicationsRepository.save(application);
    return `Application with id ${id} was disabled`;
  }

}
