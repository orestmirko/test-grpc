import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateBaseTables1734038258885 implements MigrationInterface {
    name = 'CreateBaseTables1734038258885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(20) NOT NULL, "phone" character varying(12) NOT NULL, CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_USER_PHONE" ON "users" ("phone") `);
        await queryRunner.query(`CREATE TABLE "product_compositions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quantity" integer NOT NULL DEFAULT '1', "parent_product_id" integer NOT NULL, "child_product_id" integer NOT NULL, CONSTRAINT "PK_43f64bd12585fafadf332203d70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "productType" "public"."products_producttype_enum" NOT NULL DEFAULT 'flower', "name" character varying(200) NOT NULL, "variety" character varying(100), "description" text, "image_url" character varying(255), "price" numeric(10,2) NOT NULL, "currency" "public"."products_currency_enum" NOT NULL DEFAULT 'UAH', "minimum_order_quantity" integer DEFAULT '1', "arrival_date" date, "is_fresh" boolean NOT NULL DEFAULT true, "colors" character varying array, "origin_country" character varying(100), "notes" text, "is_available" boolean NOT NULL DEFAULT true, "height_cm" numeric(5,2), "fragrance_intensity" integer, "seasonality" "public"."products_seasonality_enum", "is_packaging_required" boolean NOT NULL DEFAULT false, "packaging_type" "public"."products_packaging_type_enum" NOT NULL DEFAULT 'none', "packaging_color" character varying(50), "stock_quantity" integer NOT NULL DEFAULT '0', "tags" character varying array, "store_id" integer NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_db9b762961039d7c9f0cffc365" ON "products" ("productType") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c9fb58de893725258746385e1" ON "products" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_b19f585f887a031ba6812dad02" ON "products" ("variety") `);
        await queryRunner.query(`CREATE INDEX "IDX_20e0cba4a76f2936d1cdd9feb0" ON "products" ("is_fresh") `);
        await queryRunner.query(`CREATE INDEX "IDX_c54524c7e4f7409fd7ff2974f2" ON "products" ("is_available") `);
        await queryRunner.query(`CREATE TABLE "stores" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying(100) NOT NULL, "logoUrl" character varying(255), "mainImageUrl" character varying(255), "storeType" "public"."stores_storetype_enum", "description" text, "phone" character varying(12) NOT NULL, "email" character varying(255), "website" character varying(255), "street" character varying(255), "city" character varying(100), "region" character varying(100), "latitude" numeric(10,6), "longitude" numeric(10,6), "isCityDeliveryAvailable" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT false, "instagramUrl" character varying(255), "tiktokUrl" character varying(255), "notes" text, CONSTRAINT "UQ_5acdba4060a25169c2c792c984e" UNIQUE ("phone"), CONSTRAINT "UQ_4a946bd8ef9834431ade78d639d" UNIQUE ("email"), CONSTRAINT "UQ_c13fc01184985d8a9d70a7cba00" UNIQUE ("website"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a205ca5a37fa5e10005f003aaf" ON "stores" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_9a8b1293e56097f615d488b253" ON "stores" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_79138ff44efa83296dbecd42b8" ON "stores" ("region") `);
        await queryRunner.query(`CREATE INDEX "IDX_7cce4d6f822804bf2b153035b2" ON "stores" ("isCityDeliveryAvailable") `);
        await queryRunner.query(`CREATE INDEX "IDX_b8ad2583e5874246fc7bc88563" ON "stores" ("isActive") `);
        await queryRunner.query(`CREATE TABLE "store_work_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "day_of_week" integer NOT NULL DEFAULT '0', "open_time" TIME NOT NULL, "close_time" TIME NOT NULL, "store_id" integer, CONSTRAINT "PK_12a0e16cd9cce7cd66e40a6e88e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "admins" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "email" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "store_id" integer, CONSTRAINT "UQ_051db7d37d478a69a7432df1479" UNIQUE ("email"), CONSTRAINT "REL_22991674e8a832fa26e875cc23" UNIQUE ("store_id"), CONSTRAINT "PK_e3b38270c97a854c48d2e80874e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "product_compositions" ADD CONSTRAINT "FK_8bc1fe8c21920e27cc2202afd31" FOREIGN KEY ("parent_product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_compositions" ADD CONSTRAINT "FK_800cbf0cec9697c3ad93f53beee" FOREIGN KEY ("child_product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_68863607048a1abd43772b314ef" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_work_hours" ADD CONSTRAINT "FK_85c5b45889c13769796b7e5b338" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "admins" ADD CONSTRAINT "FK_22991674e8a832fa26e875cc235" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "admins" DROP CONSTRAINT "FK_22991674e8a832fa26e875cc235"`);
        await queryRunner.query(`ALTER TABLE "store_work_hours" DROP CONSTRAINT "FK_85c5b45889c13769796b7e5b338"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_68863607048a1abd43772b314ef"`);
        await queryRunner.query(`ALTER TABLE "product_compositions" DROP CONSTRAINT "FK_800cbf0cec9697c3ad93f53beee"`);
        await queryRunner.query(`ALTER TABLE "product_compositions" DROP CONSTRAINT "FK_8bc1fe8c21920e27cc2202afd31"`);
        await queryRunner.query(`DROP TABLE "admins"`);
        await queryRunner.query(`DROP TABLE "store_work_hours"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b8ad2583e5874246fc7bc88563"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7cce4d6f822804bf2b153035b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_79138ff44efa83296dbecd42b8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9a8b1293e56097f615d488b253"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a205ca5a37fa5e10005f003aaf"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c54524c7e4f7409fd7ff2974f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_20e0cba4a76f2936d1cdd9feb0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b19f585f887a031ba6812dad02"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4c9fb58de893725258746385e1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_db9b762961039d7c9f0cffc365"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "product_compositions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_USER_PHONE"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
