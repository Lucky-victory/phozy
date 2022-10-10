import config from "../config";
import { harpee } from "harpee";

export const connectDB = () =>
  harpee.createConnection({
    host: config.db_host,
    user: config.db_user,
    pass: config.db_pass,
  });
