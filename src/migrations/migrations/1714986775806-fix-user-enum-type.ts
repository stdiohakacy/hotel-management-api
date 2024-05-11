import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUserEnumType1714986775806 implements MigrationInterface {
    name = 'FixUserEnumType1714986775806';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'member'`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'parking_agent'`
        );
    }
}
