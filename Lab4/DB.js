var util = require("util"); // это встроенный модуль Node.js,
// который предоставляет полезные функции для работы с объектами,
// строками, асинхронными операциями и другими задачами.
var ee = require("events"); // eventemmiter

var db_data = [
  { id: 1, name: "Vladislav", bDay: "2004-04-25" },
  { id: 2, name: "Nikita", bDay: "2004-04-25" },
];

function DB() {
  this.select = async () => {
    return db_data;
  };
  this.insert = async (obj) => {
    if (obj.bDay != undefined && new Date(obj.bDay) > new Date()) {
      console.log("Error: BDay is greater than today's date.");
    }
    let elem = db_data.find((el) => el.id === obj.id);
    if (elem != null && elem != undefined) {
      console.log("ID used");
    }
    if (obj != null) {
      db_data.push(obj);
    }
    return db_data;
  };
  this.update = async (obj) => {
    if (obj.bDay != undefined && new Date(obj.bDay) > new Date()) {
      console.log("Error: BDay is greater than today's date.");
    }
    let id = parseInt(obj.id);
    let elem = db_data.find((el) => el.id === id);
    if (elem != null) {
      let index = db_data.indexOf(elem);
      if (index !== -1) {
        db_data[index] = obj;
        return obj;
      }
    }
    return null; 
  };
  this.delete = async (obj) => {
    let id = parseInt(obj.id);
    let elem = db_data.find((el) => el.id === id);
    if (elem != null) {
      let index = db_data.indexOf(elem);
      if (index !== -1) {
        db_data.splice(index, 1);
        return elem;
      }
    }
  };
}

util.inherits(DB, ee.EventEmitter); // DB наследует EventEmmiter
/*
В Node.js строка util.inherits(DB, ee.EventEmitter); означает, 
что конструктор (класс) DB объект приобретает 
функциональность, позволяющую генерировать и прослушивать события. 
*/
exports.DB = DB;
