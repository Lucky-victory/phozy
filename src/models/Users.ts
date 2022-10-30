import { harpee, HType } from "harpee";
import { connectDB } from "../config/db";
import { Utils } from "../utils";
const { Model, Schema } = harpee;
connectDB();
const usersSchema = new Schema({
  name: "phozy",
  fields: {
    fullname: HType.string().required(),
    username: HType.string().required(),
    password: HType.string(),
    email: HType.string().email().required(),
    verified: HType.bool().default(false),
    profile_image: HType.string(),
    profile_cover: HType.string(),
    socials: HType.object(),
    bio: HType.string(),
    created_at: HType.date().default(Utils.currentTime.getTime()),
    updated_at: HType.date().default(Utils.currentTime.getTime()),
  },
});

export const usersModel = new Model("users", usersSchema);
