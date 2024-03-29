import dotenv from "dotenv";
import { Config } from "./interfaces/common";
import { Utils } from "./utils";
dotenv.config();
// if (process.env.NODE_ENV !== "production") {
//   dotenv.config({
//     path: ".env",
//   });
// }

const {
  DB_HOST,
  DB_PASS,
  DB_USER,
  JWT_SECRET_KEY,
  JWT_EXPIRATION = "30m",
  CLOUDINARY_URL,ALLOWED_ORIGIN='*'
} = process.env;
if (
  Utils.isEmpty(DB_HOST) ||
  Utils.isEmpty(DB_USER) ||
  Utils.isEmpty(DB_PASS) ||
  Utils.isEmpty(JWT_SECRET_KEY) ||
  Utils.isEmpty(CLOUDINARY_URL)
) {
  // throw new Er"DB_HOST,DB_PASS,DB_USER, JWT_SECRET_KEY, and CLOUDINARY_URL are required ");
}
const config: Config = {
  db_host: DB_HOST as string,
  db_pass: DB_PASS as string,
  db_user: DB_USER as string,
  jwt_secret_key: JWT_SECRET_KEY as string,
  jwt_expiration: JWT_EXPIRATION,
  cloudinary_url: CLOUDINARY_URL as string,allowed_origin:ALLOWED_ORIGIN as string
};

export default config;
