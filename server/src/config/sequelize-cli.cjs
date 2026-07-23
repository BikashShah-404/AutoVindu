require("dotenv").config();

const commonConfigs = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  dialect: "mysql",
  dialectOptions: { charset: process.env.DB_CHARSET || "utf8mb4" },
  define: { charset: "utf8mb4", collate: "utf8mb4_unicode_ci" },
};

module.exports = {
  development: { ...commonConfigs, database: process.env.DB_NAME },
  production: {
    ...commonConfigs,
    database: process.env.DB_NAME,
    logging: false,
  },
};
