import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import path from "path";
import { User } from "../users/user.entity";
import { NoticiaEntity } from "../noticias/entities/noticia.entity";
import { PaginaEntity } from "../noticias/entities/pagina.entity";
import { UsuarioEntity } from "../usuarios/entities/usuario.entity";

config();

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: +(process.env.DB_PORT || 5434),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres",
  entities: [User, NoticiaEntity, PaginaEntity, UsuarioEntity], // 👈 explícitas
  migrations: [
    path.join(process.cwd(), "src", "database", "migrations", "*.{ts,js}"),
  ],
  synchronize: false,
  logging: true,
});
