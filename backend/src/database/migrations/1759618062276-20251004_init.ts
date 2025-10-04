import { MigrationInterface, QueryRunner } from "typeorm";

export class Init20251004_1759617936122 implements MigrationInterface {
  name = "Init20251004_1759617936122";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "paginas" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "titulo" character varying(200) NOT NULL, "slug" character varying(200) NOT NULL, "contenido" text, "estado" character varying(50) NOT NULL DEFAULT 'borrador', "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_da33a92c30474d71e7eb14051ee" UNIQUE ("slug"), CONSTRAINT "PK_bee7ea3af0c268319010bbc2e4c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_da33a92c30474d71e7eb14051e" ON "paginas" ("slug") `
    );
    await queryRunner.query(
      `CREATE TABLE "noticias" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "titulo" character varying(250) NOT NULL, "contenido" text NOT NULL, "fechaPublicacion" TIMESTAMP, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now(), "paginaId" uuid, CONSTRAINT "PK_526a107301fc9dfe8d836d6cf27" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "correoElectronico" character varying(255) NOT NULL, "nombreCompleto" character varying(255) NOT NULL, "fecha_creacion" TIMESTAMP NOT NULL DEFAULT now(), "fecha_actualizacion" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d5ba0870256945c08f3965e0fb7" UNIQUE ("correoElectronico"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_d5ba0870256945c08f3965e0fb" ON "usuarios" ("correoElectronico") `
    );
    await queryRunner.query(
      `ALTER TABLE "noticias" ADD CONSTRAINT "FK_b2b1b58844810f925be75b7c39f" FOREIGN KEY ("paginaId") REFERENCES "paginas"("id") ON DELETE SET NULL ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "noticias" DROP CONSTRAINT "FK_b2b1b58844810f925be75b7c39f"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_d5ba0870256945c08f3965e0fb"`
    );
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(`DROP TABLE "noticias"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_da33a92c30474d71e7eb14051e"`
    );
    await queryRunner.query(`DROP TABLE "paginas"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
