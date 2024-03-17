import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { User } from 'src/users/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators';


@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // Retrieve metadata set with @SetMetadata using the reflector
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    // If no role requirement is set, allow access
    if (!validRoles || validRoles.length === 0) return true;

    // Extract user data from the request
    const req = context.switchToHttp().getRequest();
    const user: User = req.user as User;

    // Check if user data exists
    if (!user) throw new BadRequestException('User not found');

    // Check if user has any of the valid roles
    for (const role of user.roles)
      if (validRoles.includes(role)) return true

    // If user doesn't have any valid role, deny access and throw a ForbiddenException
    throw new ForbiddenException(`User ${user.username} need a valid role: [${validRoles}]`)
  }
}
