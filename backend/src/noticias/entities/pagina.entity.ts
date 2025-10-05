import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { NoticiaEntity } from "./noticia.entity";

@Entity("paginas")
export class PaginaEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 200 })
  titulo!: string;

  @Index({ unique: true })
  @Column({ type: "varchar", length: 200, unique: true })
  slug!: string;

  @Column({ type: "text", nullable: true })
  contenido?: string;

  @Column({ type: "varchar", length: 50, default: "borrador" })
  estado!: string;

  @OneToMany(() => NoticiaEntity, (noticia) => noticia.pagina, {
    cascade: false,
  })
  noticias!: NoticiaEntity[];

  @CreateDateColumn({ name: "fecha_creacion" })
  fechaCreacion!: Date;

  @UpdateDateColumn({ name: "fecha_actualizacion" })
  fechaActualizacion!: Date;
}
