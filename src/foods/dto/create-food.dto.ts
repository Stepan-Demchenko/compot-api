import { IsNumber, IsString } from 'class-validator';

export class CreateFoodDto {
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

  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
    { each: true },
  )
  readonly category: number[];

  @IsNumber(
    { allowNaN: false, allowInfinity: false, maxDecimalPlaces: 2 },
    { each: true },
  )
  readonly ingredients: number[];
}
