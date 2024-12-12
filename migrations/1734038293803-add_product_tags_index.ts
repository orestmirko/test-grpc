import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProductTagsIndex1734038293803 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE INDEX "IDX_PRODUCT_TAGS_GIN" ON "products" USING GIN ("tags")`
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_PRODUCT_TAGS_GIN"`);
    }

}
