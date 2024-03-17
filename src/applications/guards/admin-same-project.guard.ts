import { Injectable, CanActivate, ExecutionContext, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Injectable()
export class AdminSameProjectGuard implements CanActivate {

  canActivate(context: ExecutionContext,): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as User;

    const projectUID = req.body?.['projectUID']
    const project = user.projects?.filter(it => it.id === projectUID)

    if (project.length <= 0)
      throw new NotFoundException(`Project with UID ${projectUID} not found.`)

    if (!project[0].isActive)
      throw new ForbiddenException(`Project with UID ${projectUID} isn't active. Please activate it before add an application.`)

    return true;
  }
}