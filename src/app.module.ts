import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import AppDataSource from "./database/data-source";
import { UsersModule } from "./users/users.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        // Reutiliza la config del DataSource para Nest
        return {
          ...AppDataSource.options,
          autoLoadEntities: true,
        } as any;
      },
    }),
    UsersModule,
  ],
})
export class AppModule {}
