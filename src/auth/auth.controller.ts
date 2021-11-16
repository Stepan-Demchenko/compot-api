import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';

import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('avatar'))
  signUp(@Body() createUserDto: CreateUserDto, @UploadedFile() avatar: Express.Multer.File) {
    return this.authService.signUp(createUserDto, avatar);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<{ accessToken: string }> {
    return this.authService.logIn(loginDto);
  }
}
