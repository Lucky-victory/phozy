import { harpee, HType } from "harpee";
import { MyUtils } from "my-node-ts-utils";
import { connectDB } from "../config/db";
const { Model, Schema } = harpee;

connectDB();
const photosSchema = new Schema({
  name: "phozy",
  fields: {
    user_id: HType.string().required(),
    url: HType.string().required(),
    caption: HType.string().allow(""),
    created_at: HType.date().default(MyUtils.currentTime.getTime()),
    updated_at: HType.ref("created_at"),
    likes: HType.object({
      count:HType.number(),users:HType.array()
    }).default({count:0,users:[]}),
   
    tags: HType.array().default([]).items({ title: HType.string() }),
    views: HType.number().default(0),
  },
});
export const photosModel = new Model("photos", photosSchema);
