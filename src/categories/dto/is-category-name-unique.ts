import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Inject, Injectable } from '@nestjs/common';
import { CategoriesService } from '../categories.service';

@ValidatorConstraint({ name: 'isNameUnique', async: true })
@Injectable()
export class IsCategoryNameUnique implements ValidatorConstraintInterface {
  constructor(
    @Inject('CategoriesService')
    private readonly categoriesService: CategoriesService,
  ) {}

  async validate(name: string, args: ValidationArguments) {
    const foundCategory = await this.categoriesService.findOneByName(name);
    return Promise.resolve(!foundCategory); // for async validations you must return a Promise<boolean> here
  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Category name should be unique';
  }
}
