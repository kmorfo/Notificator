import { Reflector } from '@nestjs/core';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

import { User } from 'src/users/entities/user.entity';
import { META_ROLES } from 'src/decorators';


@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector
  ) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    //A traves del reflector y el @SetMetadata podemos obtener la info que se introdujo  
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());

    //Si no se ha establecido el requisito de ningun rol
    if(!validRoles || validRoles.length===0) return true;

    //Obtenemos los datos del usuario
    const req = context.switchToHttp().getRequest();
    const user: User = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles)
      if (validRoles.includes(role)) return true

    console.log('UserRoleGuard', validRoles)
    throw new ForbiddenException(`User ${user.fullName} need a valid role: [${validRoles}]`)
  }
}
//Para crear el guard $nest g gu auth/guards/userRole 