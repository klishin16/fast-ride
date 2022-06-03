import Joi from "@hapi/joi";

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string().valid(
    'development',
    'production',
    'test',
    'provision',
  ).default('development'),

  DB_HOST: Joi.string().required(),

  DB_PORT: Joi.number().default(5432),
  DB_SCHEMA: Joi.string().default('fast-rider'),

  PORT: Joi.number().default(3000),

  JWT_ACCESS_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
});
