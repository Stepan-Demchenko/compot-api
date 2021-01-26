import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { JwtStrategy } from './jwt.strategy';
import { AuthService } from './auth.service';
import { RolesGuard } from './guards/roles.guard';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth-guard.guard';

@Module({
  controllers: [AuthController],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: `jwt`,
    }),
    JwtModule.register({
      secret: `secret-key`,
      signOptions: {
        expiresIn: 360000,
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
