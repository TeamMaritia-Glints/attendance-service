'use strict';

console.log('sebenernya masuk sini ga sih')

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV.trim() || 'development';
const config = require(__dirname + '../config/config.js')[env];
const db = {};

// var sequelize = new Sequelize(config.database, config.username, config.password, {
//   host: 'instance-employee-attendance.cvvnhqbxgrjz.us-east-1.rds.amazonaws.com',
//   port: 3306,
//   logging: console.log,
//   maxConcurrentQueries: 100,
//   dialect: 'mysql',
//   dialectOptions: {
//       ssl:'Amazon RDS'
//   },
//   pool: { maxConnections: 5, maxIdleTime: 30},
//   language: 'en'
// })

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  console.log(config)
  sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    retry: {
      match: [Sequelize.ConnectionError]
    },
    pool: {
      max: 5,
      min: 1,
      acquire: 30000,
      idle: 28800
    },
    dialectOptions: {
      connectTimeout: 120000
    }
  });
  testConnection(sequelize)
} 

async function testConnection(sequelizeInstance) {
  try {
    await sequelizeInstance.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
