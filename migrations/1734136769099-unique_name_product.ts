import { MigrationInterface, QueryRunner } from "typeorm";

export class UniqueNameProduct1734136769099 implements MigrationInterface {
    name = 'UniqueNameProduct1734136769099'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "UQ_a205ca5a37fa5e10005f003aaf3" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "UQ_a205ca5a37fa5e10005f003aaf3"`);
    }

}
