import permissionData from "../data/permissionData.js";
import roleData from "../data/roleData.js";
import settingData from "../data/settingData.js";
import userData from "../data/userData.js";
import Permission from "../models/permissionModel.js";
import Role from "../models/roleModel.js";
import Setting from "../models/settingModel.js";
import User from "../models/userModel.js";

const initDb = async () => {
  try {
    const permissionCount = await Permission.countDocuments();
    if (permissionCount === 0) {
      await Permission.insertMany(permissionData);
      console.log("Permissions inserted successfully.");
    }
    const roleCount = await Role.countDocuments();
    if (roleCount === 0) {
      await Role.insertMany(roleData);
      console.log("Roles inserted successfully.");
    }
    const settingCount = await Setting.countDocuments();
    if (settingCount === 0) {
      await Setting.insertMany(settingData);
      console.log("Settings inserted successfully.");
    }
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.insertMany(userData);
      console.log("Users inserted successfully.");
    }
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};

export default initDb;
