import dotenv from "dotenv";
dotenv.config();

import { z } from "zod";
import type { StringValue } from "ms";

const jwtExpirySchema = z.custom<StringValue>();

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("production"),
    PORT: z.coerce.number().default(8000),
    CLIENT_URL: z.string(),

    //   Database ENVS:
    DB_HOST: z.string().default("localhost"),
    DB_PORT: z.coerce.number().default(5000),
    DB_ROOT_PASSWORD: z.string(),
    DB_NAME: z.string().default("autovindu-db"),
    DB_USER: z.string().default("autovindu"),
    DB_PASSWORD: z.string(),
    DB_CHARSET: z.string().default("utf8mb4"),
    DB_POOL_MAX: z.coerce.number().default(10),
    DB_POOL_MIN: z.coerce.number().default(0),
    DB_POOL_ACQUIRE: z.coerce.number().default(30000),
    DB_POOL_IDLE: z.coerce.number().default(10000),

    // Bcrypt:
    BCRYPT_HASH_SALT: z.coerce.number().default(12),

    // JWT_EXPIRIES:
    JWT_ACCESS_EXPIRY: jwtExpirySchema.default("30m"),
    JWT_REFRESH_EXPIRY: jwtExpirySchema.default("1d"),
  })
  .transform(
    ({
      NODE_ENV,
      PORT,
      DB_HOST,
      DB_PORT,
      DB_ROOT_PASSWORD,
      DB_NAME,
      DB_USER,
      DB_PASSWORD,
      DB_CHARSET,
      DB_POOL_MAX,
      DB_POOL_MIN,
      DB_POOL_ACQUIRE,
      DB_POOL_IDLE,
      BCRYPT_HASH_SALT,
      CLIENT_URL,
      JWT_ACCESS_EXPIRY,
      JWT_REFRESH_EXPIRY,
    }) => ({
      nodeEnv: NODE_ENV,
      port: PORT,
      clientURL: CLIENT_URL,
      db: {
        name: DB_NAME,
        user: DB_USER,
        rootPassword: DB_ROOT_PASSWORD,
        password: DB_PASSWORD,
        host: DB_HOST,
        port: DB_PORT,
        charset: DB_CHARSET,
        poolMax: DB_POOL_MAX,
        poolMin: DB_POOL_MIN,
        poolAcquire: DB_POOL_ACQUIRE,
        poolIdle: DB_POOL_IDLE,
      },
      hashSalt: BCRYPT_HASH_SALT,
      jwt: {
        access: {
          expiresIn: JWT_ACCESS_EXPIRY,
        },
        refresh: {
          expiresIn: JWT_REFRESH_EXPIRY,
        },
      },
    }),
  );

export const envVariables = envSchema.parse(process.env);
