import {MigrationInterface, QueryRunner} from "typeorm";

export class TicketTierCreateTable1667741256552 implements MigrationInterface {
    name = 'TicketTierCreateTable1667741256552'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "ticket-tiers_status_enum" AS ENUM('active', 'inactive')`);
        await queryRunner.query(`
            CREATE TABLE "ticket-tiers" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "sale_start" TIMESTAMP WITH TIME ZONE NOT NULL, 
                "sale_end" TIMESTAMP WITH TIME ZONE NOT NULL, 
                "status" "ticket-tiers_status_enum" NOT NULL DEFAULT 'inactive', 
                
                CONSTRAINT "PK_a847eebc403cb2743d1f619e533" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "ticket-tiers"`);
        await queryRunner.query(`DROP TYPE "ticket-tiers_status_enum"`);
    }

}
