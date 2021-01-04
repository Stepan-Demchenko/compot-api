import { IsNumber, IsString } from 'class-validator';

export class CreateFoodDto {
  @IsString()
  readonly title: string;

  @IsNumber({ allowInfinity: true, maxDecimalPlaces: 2 })
  readonly price: number;

  @IsNumber({ allowInfinity: true, maxDecimalPlaces: 2 })
  readonly weight: number;

  @IsString()
  readonly img: string;

  @IsString()
  readonly description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  ingredients: any[];

  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  categories: any[];
}
