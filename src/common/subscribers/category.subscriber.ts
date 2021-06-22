import { Connection, EntitySubscriberInterface, EventSubscriber, RemoveEvent } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
@EventSubscriber()
export class CategorySubscriber implements EntitySubscriberInterface<Category> {
  constructor(private readonly connection: Connection) {
    connection.subscribers.push(this);
  }

  beforeRemove(event: RemoveEvent<Category>): Promise<any> | void {
    const queryRunner = this.connection.createQueryRunner();
  }
}
