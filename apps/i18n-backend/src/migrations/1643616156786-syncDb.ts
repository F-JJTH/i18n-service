import {MigrationInterface, QueryRunner} from "typeorm";

export class syncDb1643616156786 implements MigrationInterface {
    name = 'syncDb1643616156786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "definition" DROP COLUMN "picture"`);
        await queryRunner.query(`ALTER TABLE "definition" ADD "pictureUrl" character varying`);
        await queryRunner.query(`ALTER TABLE "definition" ADD "pictureKey" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "definition" DROP COLUMN "pictureKey"`);
        await queryRunner.query(`ALTER TABLE "definition" DROP COLUMN "pictureUrl"`);
        await queryRunner.query(`ALTER TABLE "definition" ADD "picture" character varying`);
    }

}
