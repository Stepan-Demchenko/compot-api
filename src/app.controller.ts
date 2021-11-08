import { Controller, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Get()
  @UseInterceptors(FileInterceptor('images'))
  getHello(@UploadedFile() file: Express.Multer.File): any {
    return this.appService.getHello(file);
  }
}
