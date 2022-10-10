import { harpee, HType } from "harpee";
const { Model, Schema } = harpee;
import { MyUtils } from "my-node-ts-utils";

const albumsSchema = new Schema({
  name: "phozy",
  fields: {
    user_id: HType.string().required(),
    title: HType.string().required(),
    description: HType.string(),
    is_public: HType.bool().default(true),
    created_at: HType.date().default(MyUtils.currentTime.getTime()),
    updated_at: HType.ref("created_at"),
  },
});

export const albumsModel = new Model("albums", albumsSchema);
