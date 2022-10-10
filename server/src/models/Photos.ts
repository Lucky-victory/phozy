import { harpee, HType } from "harpee";
import { MyUtils } from "my-node-ts-utils";
const { Model, Schema } = harpee;

const photosSchema = new Schema({
  name: "phozy",
  fields: {
    user_id: HType.string().required(),
    url: HType.string().required(),
    album_id: HType.string().required(),
    caption: HType.string(),
    created_at: HType.date().default(MyUtils.currentTime.getTime()),
    updated_at: HType.ref("created_at"),
    likes: HType.object({
      count: HType.number().default(0),
      users: HType.array().default([]),
    }),
    tags: HType.array().default([]),
    views: HType.number().default(0),
  },
});
export const photosModel = new Model("photos", photosSchema);
