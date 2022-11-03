import { albumsModel } from "../models/Albums";
import { photosModel } from "../models/Photos";
import { usersModel } from "../models/Users";
import { connectDB } from "./db";

connectDB();
const initDB = async () => {
  await albumsModel.init();
  await photosModel.init();
  await usersModel.init();
  console.log("db initialized");
};
initDB();
export default initDB;
