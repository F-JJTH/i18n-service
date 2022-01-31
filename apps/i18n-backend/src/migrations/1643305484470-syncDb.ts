import {MigrationInterface, QueryRunner} from "typeorm";

export class syncDb1643305484470 implements MigrationInterface {
    name = 'syncDb1643305484470'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "publishedPreprodAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "publishedProdAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "publishedProdAt" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product" ALTER COLUMN "publishedPreprodAt" SET NOT NULL`);
    }

}
