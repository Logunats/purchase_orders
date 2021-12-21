require('dotenv').config();

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  fileLocationUrl: process.env.FILE_LOCATION_URL,
  development: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port:process.env.DB_PORT,
    queueLimit : 0, // unlimited queueing
    connectionLimit : 0 // unlimited connections
  },
  production: {
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
  }
};

module.exports = config;
