import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../interfaces/error-response.interface';
import { ResponseFactory } from '../factories/response-factory';

@Catch(HttpException)
export class HttpExceptionFilter<T extends HttpException> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const request = ctx.getRequest<Request>();

    const errorResponse: ErrorResponse | any =
      typeof response === 'string'
        ? {
            message: exceptionResponse,
            path: request,
            timestamp: new Date().toISOString(),
          }
        : (exceptionResponse as any);

    response.status(status).json(ResponseFactory.error(errorResponse));
  }
}
