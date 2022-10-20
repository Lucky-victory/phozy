import { harpee } from "harpee";
import config from "../../config";

export const connectDB = () =>
  harpee.createConnection({
    host: config.db_host,
    user: config.db_user,
    pass: config.db_pass,
  });
