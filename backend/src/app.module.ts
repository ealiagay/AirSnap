import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import AppDataSource from "./database/data-source";
import { UsersModule } from "./users/users.module";
import { UsuariosModule } from "./usuarios/usuarios.module";
import { NoticiasModule } from "./noticias/noticias.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => ({
        ...AppDataSource.options,
        autoLoadEntities: true,
      }),
    }),
    UsersModule,
    UsuariosModule,
    NoticiasModule,
  ],
})
export class AppModule {}
