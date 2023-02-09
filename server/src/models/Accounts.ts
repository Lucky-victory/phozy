import { harpee, HType } from "harpee";
import { connectDB } from "../config/db";
import { Utils } from "../utils";
const { Model, Schema } = harpee;
connectDB();
const AccountsSchema = new Schema({
  name: "phozy",
  fields: {
    provider:HType.string().required(),providerUserId:[HType.string(),HType.number],userId:HType.string(),
    created_at: HType.date().default(Utils.currentTime.getTime()),
    updated_at: HType.ref("created_at"),
  },
});

export const usersModel = new Model("accounts", AccountsSchema);
