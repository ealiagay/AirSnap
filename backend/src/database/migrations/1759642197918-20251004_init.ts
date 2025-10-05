import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1759642197918 implements MigrationInterface {
    name = 'Init1759642197918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "fecha_creacion"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "fecha_actualizacion"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "fechaNacimiento" date`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "latitud" numeric(9,6)`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "longitud" numeric(9,6)`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "enfermedad" character varying(120)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "enfermedad"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "longitud"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "latitud"`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "fechaNacimiento"`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
