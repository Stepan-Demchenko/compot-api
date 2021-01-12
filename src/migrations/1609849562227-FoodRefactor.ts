import { MigrationInterface, QueryRunner } from 'typeorm';

export class FoodRefactor1609849562227 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "food" RENAME COLUMN "img" TO "image"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "food" RENAME COLUMN "image" TO "img"`,
    );
  }
}
