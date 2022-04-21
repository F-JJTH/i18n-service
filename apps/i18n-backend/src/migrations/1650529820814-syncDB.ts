import {MigrationInterface, QueryRunner} from "typeorm";

export class syncDB1650529820814 implements MigrationInterface {
    name = 'syncDB1650529820814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" ADD "isSlackNotificationEnabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "product" ADD "slackNotificationChannelName" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "slackNotificationChannelName"`);
        await queryRunner.query(`ALTER TABLE "product" DROP COLUMN "isSlackNotificationEnabled"`);
    }

}
