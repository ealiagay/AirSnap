import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { PaginaEntity } from "./pagina.entity";

@Entity("noticias")
export class NoticiaEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 250 })
  titulo!: string;

  @Column({ type: "text" })
  contenido!: string;

  @Column({ type: "timestamp", nullable: true })
  fechaPublicacion?: Date | null;

  @ManyToOne(() => PaginaEntity, (pagina) => pagina.noticias, {
    nullable: true,
    onDelete: "SET NULL",
  })
  pagina?: PaginaEntity | null;

  @CreateDateColumn({ name: "fecha_creacion" })
  fechaCreacion!: Date;

  @UpdateDateColumn({ name: "fecha_actualizacion" })
  fechaActualizacion!: Date;
}
