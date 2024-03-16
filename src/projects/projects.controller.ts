import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';

import { Auth, GetUser } from 'src/auth/decorators';
import { CreateProjectDto } from './dto/create-project.dto';
import { NotAnotherProjectGuard } from './guards/not-another-project.guard';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from 'src/auth/interfaces';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) { }

  @Post()
  @Auth(ValidRoles.admin)
  @UseGuards(AuthGuard(), NotAnotherProjectGuard)
  @ApiResponse({ status: 201, description: 'Project was created', type: Project })
  @ApiResponse({ status: 400, description: 'Bad request | Project already registered.' })
  @ApiResponse({ status: 401, description: 'Unauthorized, Token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  create(
    @Body() createProjectDto: CreateProjectDto,
    @GetUser() user: User
  ) {
    return this.projectsService.create(createProjectDto, user);
  }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Returns array of projects', type: Array<Project> })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.projectsService.findAll(paginationDto, user);
  }

  @Get(':term')
  @Auth()
  @ApiResponse({ status: 200, description: 'Returns project object', type: Project })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(
    @Param('term') term: string,
    @GetUser() user: User
  ) {
    console.log(`Get ${term}`)
    return this.projectsService.findOne(term, user);
  }

  @Patch(':term')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'Returns project object', type: Project })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('term') term: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @GetUser() user: User
  ) {
    return this.projectsService.update(term, updateProjectDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'Project was disabled' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.projectsService.remove(id, user);
  }
}
