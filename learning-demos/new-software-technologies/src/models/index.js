import dbConfig from "../configurations/dbConfig.js";
import { Sequelize, DataTypes } from "sequelize";
import userModel from "./userModel.js";

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = userModel(sequelize, DataTypes);

db.sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Re-sync done!");
  })
  .catch((error) => {
    console.error("Error syncing the database:", error);
  });

export default db;
