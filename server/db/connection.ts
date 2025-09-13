import CONFIG from '../config';
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  CONFIG.MYSQLDB.DATABASE_NAME as string,
  CONFIG.MYSQLDB.USERNAME as string,
  CONFIG.MYSQLDB.PASSWORD,

  {
    host: CONFIG.MYSQLDB.HOST,
    port: CONFIG.MYSQLDB.PORT,
    dialect: 'mysql',
    logging: false,
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
      ],
      max: 5,
    },
    pool: {
      max: 15,
      min: 1,
      idle: 20000,
      evict: 15000,
      acquire: 30000
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.info('INFO - Database connected.');
  })
  .catch((err) => {
    console.error('ERROR - Unable to connect to the database:', err);
  });

if (CONFIG.NODE_ENV === 'dev') {
  sequelize
    .sync({ alter:true })
    .then(() => {
      console.log('All Models synced succesfully:');
    })
    .catch((error) => {
      console.log('Error syncing db models: ', error);
    });
}

export default sequelize;
sequelize.authenticate();
