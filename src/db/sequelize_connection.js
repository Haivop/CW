const mysql = require("mysql2");
const {Sequelize} = require("sequelize");

const sequelize = new Sequelize('rythm_flow', 'root', 'Ro0t_$v_dB-m7', {
    host: 'localhost',
    dialect: 'mysql',
    logging: console.log
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = sequelize;

