import { from, Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { filter, map, pluck } from 'rxjs/operators';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UsersService,
  ) {}

  canActivate(context: ExecutionContext): boolean | Observable<boolean> {
    const requiredRoles: UserRole[] = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (requiredRoles.length < 1) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest<{ user: User }>();
    return from(this.userService.findOne({ id: user.id })).pipe(
      filter((user: User) => !!user),
      pluck('role'),
      map((role: UserRole) =>
        requiredRoles.some((requiredRole: UserRole) => requiredRole === role),
      ),
    );
  }
}
