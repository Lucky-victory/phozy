import { harpee, HType } from "harpee";

import { connectDB } from "../config/db";
import { Utils } from "../utils";
const { Model, Schema } = harpee;

connectDB();
const photosSchema = new Schema({
  name: "phozy",
  fields: {
    user_id: HType.string().required(),
    url: HType.string().required(),
    caption: HType.string().allow(""),
    created_at: HType.date().default(Utils.currentTime.getTime()),
    updated_at: HType.date().default(Utils.currentTime.getTime()),
    likes: HType.object({
      count: HType.number(),
      users: HType.array(),
    }).default({ count: 0, users: [] }),

    tags: HType.array().default([]).items({ title: HType.string() }),
    views: HType.number().default(0),
  },
});
export const photosModel = new Model("photos", photosSchema);
