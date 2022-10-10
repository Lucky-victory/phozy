import { harpee, HType } from "harpee";
import { MyUtils } from "my-node-ts-utils";
const { Model, Schema } = harpee;

const usersSchema = new Schema({
  name: "phozy",
  fields: {
    fullname: HType.string().required(),
    username: HType.string().required(),
    password: HType.string(),
    email: HType.string().email().required(),
    verified: HType.bool().default(false),
    profile: HType.object({
      image: HType.string(),
      cover: HType.string(),
    }),
    socials: HType.object(),
    created_at: HType.date().default(MyUtils.currentTime.getTime()),
    updated_at: HType.ref("created_at"),
  },
});

export const usersModel = new Model("users", usersSchema);
