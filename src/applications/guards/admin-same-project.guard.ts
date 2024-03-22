import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { ProjectsService } from 'src/projects/projects.service';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class AdminSameProjectGuard implements CanActivate {

  constructor(
    private readonly projectService: ProjectsService
  ) { }

  async canActivate(context: ExecutionContext,): Promise<boolean> {
    // Extract request object from the context
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as User;// Extract user data from the request

    // Extract projectUID from request body
    const projectUID = req.body?.['projectUID']
    // Filter user's projects to find the project with the specified projectUID
    const project = await this.checkUserProject(projectUID, user)

    // If no project with the specified projectUID is found, throw a NotFoundException
    if (!project)
      throw new NotFoundException(`Project with UID ${projectUID} not found.`)
    // If the project is not active, throw a ForbiddenException
    if (!project.isActive)
      throw new ForbiddenException(`Project with UID ${projectUID} isn't active. Please activate it before add an application.`)

    // If the project is found and active, allow access
    return true;
  }

  async checkUserProject(projectUID: string, user: User): Promise<Project | undefined> {
    return await this.projectService.findOne(projectUID, user)
  }
}