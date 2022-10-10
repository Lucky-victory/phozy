import { albumsModel } from "../models/Albums";
import { photosModel } from "../models/Photos";
import { connectDB } from "./db";

connectDB();
const initDB = async () => {
  await albumsModel.init();
  await photosModel.init();
  console.log("db initialized");
};
initDB();
export default initDB;
