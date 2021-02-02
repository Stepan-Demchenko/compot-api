import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';

import { ResponseFactory } from '../factories/response-factory';
import { ErrorResponse } from '../interfaces/error-response.interface';
import { UpdateValuesMissingError } from 'typeorm/error/UpdateValuesMissingError';

@Catch(QueryFailedError, UpdateValuesMissingError)
export class TypeOrmExceptionFilter<T extends QueryFailedError> implements ExceptionFilter {
  catch(exception: T, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();

    const { message, detail } = exception as any;
    const request = context.getRequest<Request>();
    const { url } = request;
    const errorResponse: ErrorResponse = {
      path: url,
      timestamp: new Date().toISOString(),
      message,
      detail,
    };

    response.status(HttpStatus.BAD_REQUEST).json(ResponseFactory.error(errorResponse));
  }
}
