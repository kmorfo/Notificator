import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { isUUID } from 'class-validator';

import { CreateProjectDto } from './dto/create-project.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Project } from './entities/project.entity';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger('ProjectsService');

  constructor(
    @InjectRepository(Project)
    private readonly projectsRepository: Repository<Project>
  ) { }

  async create(createProjectDto: CreateProjectDto, user: User): Promise<Project | undefined> {
    try {
      const project = await this.projectsRepository.create(createProjectDto);
      project.user = user
      return this.projectsRepository.save(project);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto, user: User): Promise<Project[]> {
    try {
      const { limit = 10, offset = 0 } = paginationDto;
      return await this.projectsRepository.find({
        // relations: { user: true }, //If you want to show user data, discomment this line
        where: { user: user },
        take: limit,
        skip: offset,
      })
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string, user: User): Promise<Project | undefined> {
    let project: Project;
    if (isUUID(term))
      project = await this.projectsRepository.findOne({ where: { id: term, isActive: true, user: user } })
    else
      project = await this.projectsRepository.findOne({ where: { name: term, isActive: true, user: user } })

    if (!project) throw new NotFoundException(`Project with ${term} not found`);
    return project;
  }

  async findOneByName(name: string): Promise<Project | undefined> {
    return await this.projectsRepository.findOne({ where: { name } });
  }

  async checkIfProjectIsActive(term: string, user: User): Promise<boolean | undefined> {
    const project = await this.findOne(term, user)
    return project.isActive
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, user: User): Promise<Project | undefined> {
    const project = await this.findOne(id, user);

    try {
      await this.projectsRepository
        .createQueryBuilder()
        .update(project)
        .set({ ...updateProjectDto })
        .where({ id: id, user: user })
        .execute();

      //Returned project with new data     
      return await this.findOne(id, user);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }


  async remove(id: string, user: User): Promise<string | undefined> {
    //I dont delete the project, only set isActive to false
    const project = await this.findOne(id, user);
    project.isActive = false;
    this.projectsRepository.save(project);
    return `Project with id ${id} was disabled`;
  }

  private handleDBExceptions(error: any): never {
    console.log(error);
    this.logger.error(error);
    if (error.code === '23505') throw new BadRequestException(error.detail);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }
}
