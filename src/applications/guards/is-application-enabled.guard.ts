import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { request } from 'express';
import { Observable } from 'rxjs';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { ApplicationsService } from '../applications.service';

@Injectable()
export class IsCompanyEnabledGuard implements CanActivate {
  constructor(
    private readonly userService: UsersService,
    private readonly applicationService: ApplicationsService
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //TODO: Create this Guard
    //Get request Authenticated user 
    const req = context.switchToHttp().getRequest();
    const user: User = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    // Check the HTTP method to adjust parameter extraction accordingly
    const method = request.method;
    let applicationId = (method === 'PUT' || method === 'POST')
      ? request.body.tableName
      : request.params.tableName

    console.log(applicationId)

    //check if application exist and isActive







    // if (!user.application.isActive) throw new ForbiddenException(`Company ${user.company.name} is not active in the system, contact with the administrator.`);

    return true;
  }
}
