import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth-guard.guard';
import { RolesGuard } from './guards/roles.guard';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: `${process.env.PASSPORT_STRATEGY}`,
    }),
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
