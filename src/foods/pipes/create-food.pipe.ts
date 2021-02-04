import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import arrayOfNumbersToArrayOfObjects from '../../common/utils/arrayOfNumbersToArrayOfObjects';

@Injectable()
export class CreateFoodPipe implements PipeTransform {
  async transform(value: { [key: string]: string } | any | unknown, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }
    if (value.ingredients) {
      value.ingredients = JSON.parse(value.ingredients);
      value.ingredients = arrayOfNumbersToArrayOfObjects(value.ingredients);
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    return value;
  }
}
