import { harpee, HType } from "harpee";
const { Model, Schema } = harpee;

import { connectDB } from "../config/db";
import { Utils } from "../utils";
connectDB();
const albumsSchema = new Schema({
  name: "phozy",
  fields: {
    user_id: HType.string().required(),
    title: HType.string().required(),
    description: HType.string().allow(""),
    is_public: HType.bool().default(true),
    created_at: HType.date().default(Utils.currentTime.getTime()),
    updated_at: HType.date().default(Utils.currentTime.getTime()),
    photos: HType.array().default([]),
  },
});

export const albumsModel = new Model("albums", albumsSchema);
