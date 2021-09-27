require('dotenv').config();

const {
  DB_NAME,
  DB_USERNAME,
  DB_PASSWORD,
  DB_HOSTNAME,
  DB_PORT,
} = process.env;

module.exports={
  "development": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOSTNAME,
    "port": DB_PORT,
    "dialect": "mysql",
    logging: console.log,

    dialectOptions: {
      connectTimeout: 120000
    }

  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },

  "production": {
    "username": DB_USERNAME,
    "password": DB_PASSWORD,
    "database": DB_NAME,
    "host": DB_HOSTNAME,
    "port": DB_PORT,
    "dialect": "mysql",
    dialectOptions: {
      connectTimeout: 120000
    }
   },
}
