import {MigrationInterface, QueryRunner} from "typeorm";

export class syncDb1643635091866 implements MigrationInterface {
    name = 'syncDb1643635091866'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "publishedPreprodAt"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "publishedPreprodAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "publishedProdAt"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "publishedProdAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "publishedProdAt"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "publishedProdAt" character varying`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "publishedPreprodAt"`);
        await queryRunner.query(`ALTER TABLE "product" ADD "publishedPreprodAt" character varying`);
    }

}
