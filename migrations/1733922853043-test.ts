import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1733922853043 implements MigrationInterface {
    name = 'Test1733922853043'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_work_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dayOfWeek" integer NOT NULL, "openTime" TIME NOT NULL, "closeTime" TIME NOT NULL, "store_id" integer, CONSTRAINT "PK_12a0e16cd9cce7cd66e40a6e88e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "logoUrl" character varying(255), "description" text, "phone" character varying(12) NOT NULL, "email" character varying(255), "website" character varying(255), "street" character varying(255), "city" character varying(100), "region" character varying(100), "latitude" numeric(10,6), "longitude" numeric(10,6), "isCityDeliveryAvailable" boolean NOT NULL DEFAULT false, "instagramUrl" character varying(255), "tiktokUrl" character varying(255), CONSTRAINT "UQ_5acdba4060a25169c2c792c984e" UNIQUE ("phone"), CONSTRAINT "UQ_4a946bd8ef9834431ade78d639d" UNIQUE ("email"), CONSTRAINT "UQ_c13fc01184985d8a9d70a7cba00" UNIQUE ("website"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a205ca5a37fa5e10005f003aaf" ON "stores" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_9a8b1293e56097f615d488b253" ON "stores" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_79138ff44efa83296dbecd42b8" ON "stores" ("region") `);
        await queryRunner.query(`CREATE INDEX "IDX_7cce4d6f822804bf2b153035b2" ON "stores" ("isCityDeliveryAvailable") `);
        await queryRunner.query(`CREATE TABLE "admins" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "store_id" integer, CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "REL_22991674e8a832fa26e875cc23" UNIQUE ("store_id"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "store_work_hours" ADD CONSTRAINT "FK_85c5b45889c13769796b7e5b338" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_22991674e8a832fa26e875cc235" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_22991674e8a832fa26e875cc235"`);
        await queryRunner.query(`ALTER TABLE "store_work_hours" DROP CONSTRAINT "FK_85c5b45889c13769796b7e5b338"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7cce4d6f822804bf2b153035b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_79138ff44efa83296dbecd42b8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a8b1293e56097f615d488b253"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a205ca5a37fa5e10005f003aaf"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "store_work_hours"`);
    }

}
