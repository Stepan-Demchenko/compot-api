import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.logIn(loginDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  test() {
    return 'ewdew';
  }
}
