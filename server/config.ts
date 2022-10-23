import dotenv from "dotenv";
import { Config } from "./src/interfaces/common";

dotenv.config({
  path:'../.env'
});

const {
  DB_HOST,
  DB_PASS,
  DB_USER,
  JWT_SECRET_KEY,
  JWT_EXPIRATION = "2h",
  CLOUDINARY_URL,
} = process.env;
// if (
//   MyUtils.isEmpty(DB_HOST) &&
//   MyUtils.isEmpty(DB_USER) &&
//   MyUtils.isEmpty(DB_PASS) &&
//   MyUtils.isEmpty(JWT_SECRET_KEY) &&
//   MyUtils.isEmpty(CLOUDINARY_URL)
// ) {
//   throw new Error(
//     "DB_HOST,DB_PASS,DB_USER, JWT_SECRET_KEY, and CLOUDINARY_URL are required "
//   );
// }
const config: Config = {
  db_host: DB_HOST as string,
  db_pass: DB_PASS as string,
  db_user: DB_USER as string,
  jwt_secret_key: JWT_SECRET_KEY as string,
  jwt_expiration: JWT_EXPIRATION,
  cloudinary_url: CLOUDINARY_URL as string,
};

export default config;