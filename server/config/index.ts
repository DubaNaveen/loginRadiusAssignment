import dotenv from "dotenv";
dotenv.config();
export default {
  MYSQLDB: {
    DATABASE_NAME:process.env.DATABASE_NAME,
    USERNAME:process.env.DB_USERNAME,
    PASSWORD:process.env.DB_PASSWORD,
    HOST:process.env.DB_HOST,
    PORT:Number(process.env.DB_PORT)
    // DATABASE_NAME: "loginRadius",
    // USERNAME: "root",
    // PASSWORD: "password",
    // HOST: "localhost",
  
  },
  RUNNING_PORT: parseInt(process.env.PORT || "3304"),
  NODE_ENV: "dev",
  WHITELISTED_DOMAINS: [process.env.LOCAL_DOMAIN],
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    REFRESH_TOKEN: process.env.JWT_REFRESH_SECRET,
    ISSUER: process.env.JWT_ISSUER,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  },
};
