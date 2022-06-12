import {IConfig} from "./config.interface";

export const configuration = () => (<IConfig>{
  NODE_ENV: process.env.NODE_ENV,
  nest: {
    host: 'localhost',
    port: parseInt(process.env.PORT, 10) || 3000,
  },
  cors: {
    enabled: true,
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'prisma',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    password: process.env.POSTGRES_PASSWORD || 'topsecret',
    name: process.env.DB_NAME || 'postgres',
    schema: process.env.DB_SCHEMA || 'fast-rider',
  },
  swagger: {
    enabled: true,
    title: 'Nestjs FTW',
    description: 'The nestjs API description',
    version: '1.5',
    path: 'api',
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'nestjsPrismaAccessSecret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
  show_config_on_start: true
});
