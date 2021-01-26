import { MetaPagination } from './meta-pagination.interface';
import { ErrorResponse } from './error-response.interface';

export interface HttpResponse<T> {
  data: T;
  errors: ErrorResponse;
  meta: MetaPagination;
  success: boolean;
}
