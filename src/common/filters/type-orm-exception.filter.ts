import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';
import { ErrorResponseInterface } from '../interfaces/error-response.interface';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter<T extends QueryFailedError>
  implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const { message, detail } = exception as any;
    const request = context.getRequest<Request>();
    const { url } = request;

    const errorResponse: ErrorResponseInterface = {
      path: url,
      timestamp: new Date().toISOString(),
      message,
      detail,
    };

    response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
  }
}
