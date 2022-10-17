import { Utils } from "./../utils/index";

import { Request, Response } from "express";
import { photosModel } from "../models/Photos";
import { IPhoto, NEW_PHOTO, PHOTO_RESULT } from "./../interfaces/Photos";
import { albumsModel } from "../models/Albums";
import { Order } from "harpee";
import { usersModel } from "../models/Users";
import { USER_RESULT } from "../interfaces/Users";
import CacheManager from "../utils/cache-manager";
const photoCache = new CacheManager();
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
      // check if th result was in cache
      const cachedData = photoCache.get<PHOTO_RESULT>("photos_" + page);
      if (cachedData) {
        res
          .status(200)
          .json({ message: "photos retrieved from cache", data: cachedData });
        return;
      }
      // get the total records and use it restrict the offset, this is crucial.

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recordCountResult = await photosModel.describeModel<any>();
      const recordCount = recordCountResult.data.record_count;

      if (recordCount - offset <= 0 || offset > recordCount) {
        res.status(200).json({ message: "No more Photos", data: [] });
        return;
      }
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
      photoCache.set(`photos_${page}`, data, 1000);
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
      const { auth } = req;
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

      let photo = await (
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

      photo = PhotosController.checkLike(photo, auth?.user?.id);

      const mergedData = Object.assign({}, photo, { user });
      // remove user_id property since the user object now has the ID
      const data = Utils.omit(mergedData, ["user_id"]);
      await photosModel.updateNested({
        id,
        path: ".views",
        value: (data: IPhoto) => {
          (data.views as number) += 1;
          return data.views;
        },
      });

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
   * @route POST /api/photos/:id/like
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

      const updatedData = await photosModel.updateNested<PHOTO_RESULT>({
        id,
        path: ".likes",
        value: (data: IPhoto) => {
          if (data?.likes?.users?.includes(userId)) return data.likes;
          data.likes.count += 1;
          data.likes.users.push(userId);

          return data.likes;
        },
      });
      const data = PhotosController.checkLike(
        updatedData.data as PHOTO_RESULT,
        userId
      );
      res.status(200).json({
        message: "photo liked successfully",
        data,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        message: "An error occcured",
        error,
      });
    }
  }
  /**
   * @desc
   * @route POST /api/photos/:id/unlike
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

      const updatedData = await photosModel.updateNested<PHOTO_RESULT>({
        id,
        path: ".likes",
        value: (data: IPhoto) => {
          if (!data?.likes?.users?.includes(userId)) return data.likes;
          data.likes.count -= 1;

          // reset to 0 incase of it mistakenly goes below 0, e.g -1
          if (data.likes.count < 0) data.likes.count = 0;
          data.likes.users = data.likes.users.filter((user) => user !== userId);

          return data.likes;
        },
      });
      const data = PhotosController.checkLike(
        updatedData.data as PHOTO_RESULT,
        userId
      );
      res.status(200).json({
        message: "photo unliked successfully",
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcured",
        error,
      });
    }
  }
  /**
   * checks if a user has liked a photo and adds a 'liked' property to the photo object
   * @param photo
   * @param userId
   * @returns
   */
  private static checkLike(photo: PHOTO_RESULT, userId: string) {
    photo.liked = photo.likes?.users?.includes(userId);
    return photo;
  }
}
