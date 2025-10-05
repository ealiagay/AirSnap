import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255, unique: true })
  correoElectronico!: string;

  @Column({ type: 'varchar', length: 255 })
  nombreCompleto!: string;

  @Column({ type: 'date', nullable: true})
  fechaNacimiento!: Date | null;

  // Guardamos con precisión 6 decimales (mejor que varchar)
  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitud!: number | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitud!: number | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  enfermedad?: string | null;
}
