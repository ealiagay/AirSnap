import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { User } from "../users/user.entity";
import { NoticiaEntity } from "@/noticias/entities/noticia.entity";
import { PaginaEntity } from "@/noticias/entities/pagina.entity";
import { UsuarioEntity } from "@/usuarios/entities/usuario.entity";

config();

export default new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "postgres",
  entities: [User, NoticiaEntity, PaginaEntity, UsuarioEntity],
  // 👇 IMPORTANTE: no incluyas .ts aquí (evita que Nest intente cargar TS en runtime)
  // migrations: ['dist/src/database/migrations/*.js'], // (opcional) si quieres dejarlas
  synchronize: false,
  logging: true,
});
