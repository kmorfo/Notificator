import { AuthGuard } from '@nestjs/passport';
import { UseGuards, applyDecorators } from '@nestjs/common';

import { RoleProtected } from './role-protected.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';


export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
  );
}
