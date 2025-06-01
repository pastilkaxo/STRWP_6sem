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

const Auditorium = require("./models/auditorium")(
  sequelize,
  Sequelize.DataTypes
);
const Auditorium_type = require("./models/auditorium_type")(
  sequelize,
  Sequelize.DataTypes
);
const Pulpit = require("./models/pulpit")(sequelize, Sequelize.DataTypes);
const Faculty = require("./models/faculty")(sequelize, Sequelize.DataTypes);
const Subject = require("./models/subject")(sequelize, Sequelize.DataTypes);
const Teacher = require("./models/teacher")(sequelize, Sequelize.DataTypes);

const setupAssociations = require("./models/associations");
const { error } = require("winston");
setupAssociations({
  Faculty,
  Pulpit,
  Subject,
  Teacher,
  Auditorium_type,
  Auditorium,
  Sequelize,
});

module.exports = {
  sequelize,
  Auditorium,
  Auditorium_type,
  Faculty,
  Pulpit,
  Subject,
  Teacher,
};
