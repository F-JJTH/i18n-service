import {MigrationInterface, QueryRunner} from "typeorm";

export class init1643300627615 implements MigrationInterface {
    name = 'init1643300627615'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "translation" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" character varying, "isRequireTranslatorAction" boolean NOT NULL DEFAULT false, "isValid" boolean NOT NULL DEFAULT false, "definitionId" uuid, "languageId" uuid, "productId" uuid, CONSTRAINT "PK_7aef875e43ab80d34a0cdd39c70" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d2cc6730f222aa9e29f5819d34" ON "translation" ("productId") `);
        await queryRunner.query(`CREATE TABLE "language" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "code" character varying NOT NULL, "isDefault" boolean NOT NULL DEFAULT false, "isDisabled" boolean NOT NULL DEFAULT false, "isRequireTranslatorAction" boolean NOT NULL DEFAULT false, "productId" uuid, CONSTRAINT "PK_cc0a99e710eb3733f6fb42b1d4c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_986ea6a0711b0da0dc30b4886b" ON "language" ("productId") `);
        await queryRunner.query(`CREATE TABLE "member_authorization" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "definitions" boolean NOT NULL DEFAULT false, "settings" boolean NOT NULL DEFAULT false, "deploy" boolean NOT NULL DEFAULT false, "validator" boolean NOT NULL DEFAULT false, "translations" text array NOT NULL DEFAULT '{}', "productId" uuid, CONSTRAINT "PK_e17ed87cc7428a5bf34014da9a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "defaultLanguage" character varying NOT NULL, "members" text array NOT NULL DEFAULT '{}', "publishedPreprodAt" character varying NOT NULL, "publishedProdAt" character varying NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "definition" ("createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slug" character varying NOT NULL, "defaultValue" character varying, "link" character varying, "picture" character varying, "productId" uuid, CONSTRAINT "PK_5eb37954eebae17387f4ebabb5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ca14ba7b0f6cc0c870c11c48ed" ON "definition" ("productId") `);
        await queryRunner.query(`ALTER TABLE "translation" ADD CONSTRAINT "FK_6124427aab5ea6d876282072361" FOREIGN KEY ("definitionId") REFERENCES "definition"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "translation" ADD CONSTRAINT "FK_7c256f0ca19bb69a49f3b23e002" FOREIGN KEY ("languageId") REFERENCES "language"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "translation" ADD CONSTRAINT "FK_d2cc6730f222aa9e29f5819d342" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "language" ADD CONSTRAINT "FK_986ea6a0711b0da0dc30b4886bb" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "member_authorization" ADD CONSTRAINT "FK_e717e36101a13efa70b60a90e84" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "definition" ADD CONSTRAINT "FK_ca14ba7b0f6cc0c870c11c48edf" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "definition" DROP CONSTRAINT "FK_ca14ba7b0f6cc0c870c11c48edf"`);
        await queryRunner.query(`ALTER TABLE "member_authorization" DROP CONSTRAINT "FK_e717e36101a13efa70b60a90e84"`);
        await queryRunner.query(`ALTER TABLE "language" DROP CONSTRAINT "FK_986ea6a0711b0da0dc30b4886bb"`);
        await queryRunner.query(`ALTER TABLE "translation" DROP CONSTRAINT "FK_d2cc6730f222aa9e29f5819d342"`);
        await queryRunner.query(`ALTER TABLE "translation" DROP CONSTRAINT "FK_7c256f0ca19bb69a49f3b23e002"`);
        await queryRunner.query(`ALTER TABLE "translation" DROP CONSTRAINT "FK_6124427aab5ea6d876282072361"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ca14ba7b0f6cc0c870c11c48ed"`);
        await queryRunner.query(`DROP TABLE "definition"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "member_authorization"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_986ea6a0711b0da0dc30b4886b"`);
        await queryRunner.query(`DROP TABLE "language"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d2cc6730f222aa9e29f5819d34"`);
        await queryRunner.query(`DROP TABLE "translation"`);
    }

}
