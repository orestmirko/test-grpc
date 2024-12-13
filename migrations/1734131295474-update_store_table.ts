import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStoreTable1734131295474 implements MigrationInterface {
    name = 'UpdateStoreTable1734131295474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "flowersCount" TO "flowers_count"`);
        await queryRunner.query(`ALTER TABLE "store_work_hours" ALTER COLUMN "open_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_work_hours" ALTER COLUMN "close_time" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_work_hours" ALTER COLUMN "close_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "store_work_hours" ALTER COLUMN "open_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "flowers_count" TO "flowersCount"`);
    }

}
