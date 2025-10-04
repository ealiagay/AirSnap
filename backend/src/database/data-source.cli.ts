import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { config } from 'dotenv'
import path from 'path'
import { User } from '../users/user.entity'

config()

const CWD = process.cwd()

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  entities: [User], // 👈 entidades explícitas
  // El CLI sí puede trabajar con .ts
  migrations: [path.join(CWD, 'src', 'database', 'migrations', '*.{ts,js}')],
  synchronize: false,
  logging: true,
})
