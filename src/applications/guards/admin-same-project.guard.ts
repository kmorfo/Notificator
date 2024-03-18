import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AdminSameProjectGuard implements CanActivate {

  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    // Extract request object from the context
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as User;// Extract user data from the request

    // Extract projectUID from request body
    const projectUID = req.body?.['projectUID']
    // Filter user's projects to find the project with the specified projectUID
    const project = user.projects?.filter(it => it.id === projectUID)

    // If no project with the specified projectUID is found, throw a NotFoundException
    if (project.length <= 0)
      throw new NotFoundException(`Project with UID ${projectUID} not found.`)
    // If the project is not active, throw a ForbiddenException
    if (!project[0].isActive)
      throw new ForbiddenException(`Project with UID ${projectUID} isn't active. Please activate it before add an application.`)

    // If the project is found and active, allow access
    return true;
  }
}