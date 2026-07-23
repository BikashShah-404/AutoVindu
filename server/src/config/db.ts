import { Sequelize } from "sequelize";
import { envVariables } from "./env.js";

const sequelize = new Sequelize(
  envVariables.db.name,
  envVariables.db.user,
  envVariables.db.password,
  {
    host: envVariables.db.host,
    port: envVariables.db.port,
    dialect: "mysql",
    logging: false,
    dialectOptions: {
      charset: envVariables.db.charset,
    },
    define: {
      timestamps: true,
      underscored: true,
      freezeTableName: true,
      charset: "utf8mb4",
      collate: "utf8mb4_unicode_ci",
    },
    pool: {
      max: envVariables.db.poolMax,
      min: envVariables.db.poolMin,
      acquire: envVariables.db.poolAcquire,
      idle: envVariables.db.poolIdle,
    },
  },
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database Successfully Connected");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
};

export default sequelize;
