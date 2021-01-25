import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard(
  `${process.env.PASSPORT_STRATEGY}`,
) {}
