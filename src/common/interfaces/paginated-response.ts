export class PaginatedResponse<T> {
  items: T[];
  meta: {
    limit: number;
    total: number;
  };

  constructor(items: T[], limit: number, total: number) {
    this.items = items;
    this.meta = {
      limit,
      total,
    };
  }
}
