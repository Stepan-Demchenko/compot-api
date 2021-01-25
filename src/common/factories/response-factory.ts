import { HttpResponse } from '../interfaces/http-response.interface';
import { MetaPagination } from '../interfaces/meta-pagination.interface';
import { ErrorResponse } from '../interfaces/error-response.interface';

export class ResponseFactory {
  static success<T>(data: T | null, meta?: MetaPagination): HttpResponse<T> {
    return {
      data: data,
      errors: null,
      meta: meta ? meta : null,
      success: true,
    };
  }

  static error(errors: ErrorResponse): HttpResponse<null> {
    return {
      data: null,
      errors: errors,
      meta: null,
      success: false,
    };
  }
}
