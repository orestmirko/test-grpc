import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUsersTable1733416513378 implements MigrationInterface {
  name = 'addUsersTable1733416513378';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(20) NOT NULL, "phone" character varying(12) NOT NULL, CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_USER_PHONE" ON "users" ("phone") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_USER_PHONE"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
