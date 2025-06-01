const Sequelize = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize("LVO", "adm", "Obobad252004", {
  host: "localhost",
  port: 1433,
  dialect: "mssql",
  dialectOptions: {
    options: { encrypt: false },
  },
  pool: {
    max: 10,
    min: 1,
    idle: 20000,
  },
});


sequelize
  .authenticate()
  .then(() => {
    console.log("Соединение с базой данных установлено");
  })
  .catch((err) => {
    console.log("Ошибка при соединении с базой данных", err);
  })
  .finally(() => {
    sequelize.close();
  });
