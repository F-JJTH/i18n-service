import {MigrationInterface, QueryRunner} from "typeorm";

export class syncDb1643308295892 implements MigrationInterface {
    name = 'syncDb1643308295892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "member_authorization" ADD "memberId" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_e0f9673c4379b4341305e066d6" ON "member_authorization" ("memberId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_e0f9673c4379b4341305e066d6"`);
        await queryRunner.query(`ALTER TABLE "member_authorization" DROP COLUMN "memberId"`);
    }

}
