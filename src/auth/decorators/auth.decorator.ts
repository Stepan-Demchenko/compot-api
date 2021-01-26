import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';

import { UserRole } from '../../common/enums/user-role.enum';
import { JwtAuthGuard } from '../guards/jwt-auth-guard.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard, RolesGuard));
}
