import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponseInterface } from '../interfaces/error-response.interface';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException>
  implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const request = ctx.getRequest<Request>();

    const errorResponse: ErrorResponseInterface | object =
      typeof response === 'string'
        ? {
            message: exceptionResponse,
            path: request,
            timestamp: new Date().toISOString(),
          }
        : (exceptionResponse as object);

    response.status(status).json(errorResponse);
  }
}
