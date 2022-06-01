export interface IConfig extends CommonConfig {
  nest: NestConfig;
  cors: CorsConfig;
  swagger: SwaggerConfig;
  graphql: GraphqlConfig;
  security: SecurityConfig;
  database: DatabaseConfig;
}

export interface NestConfig {
  host: string;
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface GraphqlConfig {
  playgroundEnabled: boolean;
  debug: boolean;
  schemaDestination: string;
  sortSchema: boolean;
}

export interface SecurityConfig {
  jwtAccessSecret: string;
  jwtRefreshSecret: string;
  expiresIn: string;
  refreshIn: string;
  bcryptSaltOrRound: string | number;
}

export interface DatabaseConfig {
  host: string;
  user: string;
  password: string;
  schema: string;
}

export interface CommonConfig {
  NODE_ENV: string;
  show_config_on_start: boolean;
}
