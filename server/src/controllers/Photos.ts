import { Utils } from "./../utils/index";

import { Request, Response } from "express";
import { photosModel } from "../models/Photos";
import { IPhoto, NEW_PHOTO, PHOTO_RESULT } from "./../interfaces/Photos";
import { albumsModel } from "../models/Albums";
import { Order } from "harpee";
import { usersModel } from "../models/Users";
import { USER_RESULT } from "../interfaces/Users";

export default class PhotosController {
  static async getAll(req: Request, res: Response) {
    try {
      let {
        page = 1,
        perPage = 10,
        sort = "desc",
        orderby = "created_at",
      } = req.query;
      const { fields } = req.query;
      perPage = +perPage;
      page = +page;
      const offset = (page - 1) * perPage;
      if (!(sort === "desc" || sort === "asc")) sort = "desc";

      const defaultFields = [
        "id",
        "created_at",
        "url",
        "user_id",
        "caption",
        "tags",
        "views",
        "likes",
      ];
      const fieldsInSchema = albumsModel.fields;
      const getAttributes = Utils.getFields(
        fields as string,
        fieldsInSchema,
        defaultFields
      );
      if (!fieldsInSchema.includes(orderby as string)) orderby = "created_at";

      const photos = await photosModel.find<PHOTO_RESULT[]>({
        getAttributes,
        limit: perPage,
        offset,
        orderby: [orderby as string],
        order: sort as Order,
      });
      // get the user IDs
      const userIds = photos.data?.map((photo) => photo.user_id) as string[];
      // query users table with it
      const users = await usersModel.findById<USER_RESULT>({
        id: userIds,
        getAttributes: ["username", "fullname", "profile_image", "id"],
      });
      // merge it with the photo before sending out to client
      let data = Utils.arrayMergeObject(photos?.data, users.data, {
        innerTitle: "user",
        innerProp: "id",
        outerProp: "user_id",
      }) as (USER_RESULT & PHOTO_RESULT)[];
      data = data.map((item) => {
        const liked = item.likes?.users?.includes(item.user_id);

        return {
          ...item,
          liked,
        };
      });
      // remove user_id property since the user object now has the ID
      data = Utils.omit(data, ["user_id"]) as (USER_RESULT & PHOTO_RESULT)[];
      res.status(200).json({ message: "photos retrieved", data });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "an error occured",
        error,
      });
    }
  }
  static async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { fields } = req.query;

      const defaultFields = [
        "id",
        "created_at",
        "url",
        "user_id",
        "caption",
        "tags",
        "views",
        "likes",
      ];
      const fieldsInSchema = albumsModel.fields;
      const getAttributes = Utils.getFields(
        fields as string,
        fieldsInSchema,
        defaultFields
      );

      const photo = await (
        await photosModel.findOne<PHOTO_RESULT>({ id }, getAttributes)
      ).data;

      if (!photo) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does no exist` });
        return;
      }
      // get the user IDs
      const userId = photo?.user_id as string;
      // query users table with it
      const user = await (
        await usersModel.findOne<USER_RESULT>({ id: userId }, [
          "username",
          "fullname",
          "profile_image",
          "id",
        ])
      ).data;
      // check if the user has liked that photo
      const hasLiked = photo.likes?.users?.includes(user?.id as string);

      // merge it with the photo before sending out to client
      const mergedData = Object.assign(
        {},
        { ...photo, liked: hasLiked },
        { user }
      );
      // remove user_id property since the user object now has the ID
      const data = Utils.omit(mergedData, ["user_id"]);
      res.status(200).json({ message: "photo retrieved successfully", data });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "an error occured",
        error,
      });
    }
  }
  /**
   * @desc add new photos
   * @route POST /api/photos
   * @param req
   * @param res
   * @returns
   */
  static async addNewPhotos(req: Request, res: Response) {
    try {
      const { photo_urls, auth } = req;

      const newPhotos: NEW_PHOTO[] = photo_urls.map((photo) => {
        return {
          url: photo.url,
          caption: photo.caption,
          tags: Utils.stringToObjectArray(photo.tags),
          user_id: auth?.user?.id,
        };
      });

      await photosModel.createMany(newPhotos);

      res.status(201).json({
        data: newPhotos,
        message: "photos added successfully",
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "an error occurred",
        error,
      });
    }
  }
  /**
   * @desc
   * @route DELETE /api/photos/:id
   * @param req
   * @param res
   * @returns
   */
  static async deletePhoto(req: Request, res: Response) {
    try {
      const { auth } = req;
      const { id } = req.params;

      const photo = await photosModel.findOne<PHOTO_RESULT>({ id });
      if (!photo.data) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does no exist` });
        return;
      }
      const hasAccess = Utils.isAuthorized(photo.data, auth.user);
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, you don't have access to this resource",
        });
        return;
      }
      await photosModel.findByIdAndRemove([id]);
      res.status(200).json({
        message: "photo deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcured",
        error,
      });
    }
  }
  /**
   * @desc
   * @route PUT /api/photos/:id
   * @param req
   * @param res
   * @returns
   */
  static async updatePhoto(req: Request, res: Response) {
    try {
      const { auth } = req;
      const { id } = req.params;

      const photo = await photosModel.findOne<PHOTO_RESULT>({ id });
      if (!photo.data) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does no exist` });
        return;
      }
      const hasAccess = Utils.isAuthorized(photo.data, auth.user);
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, you don't have access to this resource",
        });
        return;
      }
      const photoToUpdate = {
        ...req.body,
        id,
      };
      await photosModel.update([photoToUpdate]);
      res.status(200).json({
        message: "photo updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcured",
        error,
      });
    }
  }
  /**
   * @desc
   * @route PUT /api/photos/:id/like
   * @param req
   * @param res
   * @returns
   */
  static async likePhoto(req: Request, res: Response) {
    try {
      const { auth } = req;
      const { id } = req.params;
      const userId = auth?.user?.id;
      const photo = await photosModel.findOne<PHOTO_RESULT>({ id });
      if (!photo.data) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does no exist` });
        return;
      }

      await photosModel.updateNested({
        id,
        path: ".likes",
        value: (data: IPhoto) => {
          if (data?.likes?.users?.includes(userId)) return data.likes;
          data.likes.count += 1;
          data.likes.users.push(userId);
          return data.likes;
        },
      });
      res.status(200).json({
        message: "photo liked successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcured",
        error,
      });
    }
  }
  /**
   * @desc
   * @route PUT /api/photos/:id/unlike
   * @param req
   * @param res
   * @returns
   */
  static async unlikePhoto(req: Request, res: Response) {
    try {
      const { auth } = req;
      const { id } = req.params;
      const userId = auth?.user?.id;
      const photo = await photosModel.findOne<PHOTO_RESULT>({ id });
      if (!photo.data) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does no exist` });
        return;
      }

      await photosModel.updateNested({
        id,
        path: ".likes",
        value: (data: IPhoto) => {
          if (!data?.likes?.users?.includes(userId)) return data.likes;
          data.likes.count -= 1;
          data.likes.users.filter((user) => user !== userId);
          return data.likes;
        },
      });
      res.status(200).json({
        message: "photo unliked successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcured",
        error,
      });
    }
  }
}
