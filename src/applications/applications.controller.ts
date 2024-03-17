import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { AdminSameProjectGuard } from './guards/admin-same-project.guard';
import { Application } from './entities/application.entity';
import { ApplicationsService } from './applications.service';
import { Auth, GetUser } from 'src/auth/decorators';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ValidRoles } from 'src/auth/interfaces';
import { User } from 'src/users/entities/user.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@ApiTags('Applications')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) { }

  @Post()
  @Auth(ValidRoles.admin)
  @UseGuards(AuthGuard(), AdminSameProjectGuard)
  @ApiResponse({ status: 201, description: 'Application was created', type: Application })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized, Token not valid' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found. Project not found.' })
  create(
    @Body() createApplicationDto: CreateApplicationDto,
    @GetUser() user: User
  ) {
    return this.applicationsService.create(createApplicationDto, user);
  }

  @Get()
  @Auth()
  @ApiResponse({ status: 200, description: 'Returns array of Applications', type: Array<Application> })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  findAll(
    @Query() paginationDto: PaginationDto,
    @GetUser() user: User
  ) {
    return this.applicationsService.findAll(paginationDto, user);
  }

  @Get(':term')
  @Auth()
  @ApiResponse({ status: 200, description: 'Returns an application object', type: Application })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  findOne(
    @Param('term') term: string,
    @GetUser() user: User
  ) {
    return this.applicationsService.findOne(term, user);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'Returns an application object', type: Application })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @GetUser() user: User
  ) {
    return this.applicationsService.update(id, updateApplicationDto, user);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'Application was disabled' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related.' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.applicationsService.remove(id, user);
  }
}
