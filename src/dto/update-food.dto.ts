import { IsNumber, IsString } from 'class-validator';

export class UpdateFoodDto {
  @IsString()
  readonly title: string;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  readonly price: number;

  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 })
  readonly weight: number;

  @IsString()
  readonly img: string;

  @IsString()
  readonly description: string;

  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  readonly categoryIds: number[];

  @IsNumber({ allowNaN: false, allowInfinity: false }, { each: true })
  readonly ingredientIds: number[];
}
