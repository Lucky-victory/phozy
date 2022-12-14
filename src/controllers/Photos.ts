import { Utils } from "../utils/index";

import { Request, Response } from "express";
import { harpee, Order } from "harpee";
import {
  IPhoto,
  NEW_PHOTO,
  PHOTO_RESULT,
  PHOTO_TO_VIEW,
} from "../interfaces/Photos";
import { USER_RESULT } from "../interfaces/Users";
import { albumsModel } from "../models/Albums";
import { photosModel } from "../models/Photos";
import { usersModel } from "../models/Users";
import CacheManager from "../utils/cache-manager";
const photoCache = new CacheManager();
const CACHE_TIME = 120;

export default class PhotosController {
  static async getAll(req: Request, res: Response) {
    try {
      let {
        page = 1,
        perPage = 12,
        sort = "desc",
        orderby = "created_at",
      } = req.query;

      const authUser = Utils.getAuthenticatedUser(req);

      const { fields } = req.query;
      perPage = +perPage;
      page = +page;
      const offset = (page - 1) * perPage;
      if (!(sort === "desc" || sort === "asc")) sort = "desc";
      // check if the result was in cache
      let cachedData = photoCache.get<PHOTO_RESULT[]>(`photos_${page}`);
      if (cachedData) {
        cachedData = cachedData.map((photo) => {
          photo = PhotosController.checkLike(photo, authUser?.id);
          return photo;
        });
        res
          .status(200)
          .json({ message: "photos retrieved from cache", data: cachedData });
        return;
      }
      // get the total records and use it restrict the offset.

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recordCountResult = await photosModel.describeModel<any>();
      const recordCount = recordCountResult.data.record_count;

      if (recordCount - offset <= 0 || offset > recordCount) {
        res.status(200).json({ message: "No more Photos", data: [] });
        return;
      }

      const fieldsInSchema = photosModel.fields;
      const getAttributes = Utils.getFields(
        fields as string,
        fieldsInSchema,
        DEFAULT_PHOTO_FIELDS
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
      const userIds = photos.data?.map((photo) => photo?.user_id) as string[];
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
      data = data.map((photo) => {
        photo = PhotosController.checkLike(photo, authUser?.id);

        return photo;
      });
      // remove user_id property since the user object now has the ID
      data = Utils.omit(data, ["user_id"]) as (USER_RESULT & PHOTO_RESULT)[];
      photoCache.set(`photos_${page}`, data, CACHE_TIME);

      res.status(200).json({ message: "photos retrieved", data });
    } catch (error) {
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
      const authUser = Utils.getAuthenticatedUser(req);

      const fieldsInSchema = albumsModel.fields;
      const getAttributes = Utils.getFields(
        fields as string,
        fieldsInSchema,
        DEFAULT_PHOTO_FIELDS
      );

      const response = await photosModel.findOne<PHOTO_RESULT>(
        { id },
        getAttributes
      );
      let photo = response.data;
      if (!photo) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does no exist` });
        return;
      }

      let cachedPhoto = photoCache.get<PHOTO_RESULT>(`photo_${id}`);
      if (cachedPhoto) {
        cachedPhoto = PhotosController.checkLike(cachedPhoto, authUser?.id);

        res.status(200).json({
          message: "photo retrieved successfully from cache",
          data: cachedPhoto,
        });
        await photosModel.updateNested({
          id,
          path: ".views",
          value: (data: IPhoto) => {
            (data.views as number) += 1;
            return data.views;
          },
        });
        return;
      }
      /**
       the photo owner ID
       *  */
      const photoOwnerId = photo?.user_id as string;
      // query users table with it
      const user = await PhotosController.getOwner(photoOwnerId);

      photo = PhotosController.checkLike(photo, authUser?.id);

      const mergedData = Object.assign({}, photo, { user });

      // remove user_id property since the user object now has the ID
      const data = Utils.omit(mergedData, ["user_id"]);
      photoCache.set(`photo_${id}`, data, CACHE_TIME);
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
      const { photo_urls } = req;
      const authUser = Utils.getAuthenticatedUser(req);

      const newPhotos: NEW_PHOTO[] = photo_urls.map((photo) => {
        return {
          url: photo.url,
          caption: photo.caption,
          tags: Utils.stringArray(photo.tags),
          user_id: authUser?.id,
        };
      });

      await photosModel.createMany(newPhotos);

      res.status(201).json({
        data: newPhotos,
        message: "photos added successfully",
      });
    } catch (error) {
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
  static async delete(req: Request, res: Response) {
    try {
      const authUser = Utils.getAuthenticatedUser(req);
      const { id } = req.params;

      const photo = await photosModel.findOne<PHOTO_RESULT>({ id });
      if (!photo.data) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does no exist` });
        return;
      }
      const hasAccess = Utils.isAuthorized(photo.data, authUser);
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
  static async update(req: Request, res: Response) {
    try {
      const authUser = Utils.getAuthenticatedUser(req);
      const { id } = req.params;

      const photo = await photosModel.findOne<PHOTO_RESULT>({ id });
      if (!photo.data) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does no exist` });
        return;
      }
      const hasAccess = Utils.isAuthorized(photo.data, authUser);
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, you don't have access to this resource",
        });
        return;
      }
      // By default, harperDB can create new columns on update,
      // this will pick only the specified keys in Schema fields
      // and prevent any new/unknown column from being created.
      const bodyData = Utils.pick(req.body, photosModel.fields);

      const dataToUpdate = {
        ...bodyData,
        id,
      };
      await photosModel.update([dataToUpdate]);
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
   * @desc Like a photo
   * @route POST /api/photos/:id/like
   * @param req
   * @param res
   * @returns
   */
  static async like(req: Request, res: Response) {
    try {
      const { id } = req.params;
      /**
       * ID of the  authenticated user
       */
      const authUserId = Utils.getAuthenticatedUser(req)?.id;
      const response = await photosModel.findOne<PHOTO_RESULT>(
        { id },
        DEFAULT_PHOTO_FIELDS
      );

      if (!response.data) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does not exist` });
        return;
      }

      const updatedPhoto = await photosModel.updateNested<IPhoto>({
        id,
        path: ".likes",
        value: (data: IPhoto) => {
          if (data?.likes?.users?.includes(authUserId)) return data.likes;
          data.likes.count += 1;
          data.likes.users.push(authUserId);

          return data.likes;
        },
        getAttributes: DEFAULT_PHOTO_FIELDS,
      });

      let photo = updatedPhoto.data as PHOTO_RESULT;
      const user = (await PhotosController.getOwner(
        photo.user_id
      )) as USER_RESULT;
      photo = PhotosController.checkLike(photo, authUserId);

      //merge the photo object with the user object
      let photoToView = Object.assign({}, photo, { user }) as PHOTO_TO_VIEW;
      photoToView = Utils.omit(photoToView, ["user_id"]) as PHOTO_TO_VIEW;

      res.status(200).json({
        message: "photo liked successfully",
        data: photoToView,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcured",
        error,
      });
    }
  }
  /**
   * @desc Unlike a photo
   * @route POST /api/photos/:id/unlike
   * @param req
   * @param res
   * @returns
   */
  static async unlike(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const authUserId = Utils.getAuthenticatedUser(req)?.id;
      const response = await photosModel.findOne<PHOTO_RESULT>({ id });
      if (!response.data) {
        res
          .status(404)
          .json({ message: `photo with id '${id}' does no exist` });
        return;
      }

      const updatedPhoto = await photosModel.updateNested<PHOTO_RESULT>({
        id,
        path: ".likes",
        value: (data: IPhoto) => {
          if (!data?.likes?.users?.includes(authUserId)) return data.likes;
          data.likes.count -= 1;

          // reset to 0 incase it mistakenly goes below 0, e.g -1
          if (data.likes.count < 0) data.likes.count = 0;
          data.likes.users = data.likes.users.filter(
            (userId) => userId !== authUserId
          );

          return data.likes;
        },
        getAttributes: DEFAULT_PHOTO_FIELDS,
      });
      let photo = updatedPhoto.data as PHOTO_RESULT;
      const user = (await PhotosController.getOwner(
        photo.user_id
      )) as USER_RESULT;
      photo = PhotosController.checkLike(photo, authUserId);

      //merge the photo object with the user object
      let photoToView = Object.assign({}, photo, { user }) as PHOTO_TO_VIEW;
      photoToView = Utils.omit(photoToView, ["user_id"]) as PHOTO_TO_VIEW;

      res.status(200).json({
        message: "photo unliked successfully",
        data: photoToView,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcured",
        error,
      });
    }
  }
  /**
   * @desc Search photos by caption or tags
   * @route POST /api/photos/search
   * @param req
   * @param res
   * @returns
   */
  static async search(req: Request, res: Response) {
    try {
      let { q, page = 1, perPage = 10 } = req.query;

      perPage = +perPage;
      page = +page;
      const offset = (page - 1) * perPage;

      const cachedData = photoCache.get(`photos_${q}_${page}`);
      if (cachedData) {
        res.status(200).json({
          message: "search results recieved successfully from cache",
          data: cachedData,
        });
        return;
      }
      // get the total records and use it restrict the offset.

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recordCountResult = await photosModel.describeModel<any>();
      const recordCount = recordCountResult.data.record_count;

      if (recordCount - offset <= 0 || offset > recordCount) {
        res.status(200).json({ message: "No more Photos", data: [] });
        return;
      }

      q = Utils.lower(q as string);
      const response = await photosModel.findByConditions<PHOTO_RESULT[]>({
        operator: "or",
        limit: perPage,
        getAttributes: DEFAULT_PHOTO_FIELDS,
        offset,
        conditions: [
          {
            search_attribute: "caption",
            search_type: "contains",
            search_value: `${q}`,
          },
          {
            search_attribute: "tags",
            search_type: "contains",
            search_value: `${q}`,
          },
        ],
      });
      photoCache.set(`photos_${q}_${page}`, response.data, CACHE_TIME);
      res.status(200).json({
        message: "search results recieved",
        data: response.data,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcured couldn't search photos",
        error,
      });
    }
  }
  /**
   * Get the photo owner from users model
   */
  private static async getOwner(
    userId: string,
    columns = ["username", "fullname", "profile_image", "id", "socials"]
  ) {
    try {
      const response = await usersModel.findOne<USER_RESULT>(
        { id: userId },
        columns
      );
      const user = response.data;
      return user;
    } catch (_) {
      //
    }
  }
  static async getByIds(
    ids: string[],
    authUserId?: string
  ): Promise<PHOTO_RESULT[] | null> {
    try {
      const response = await photosModel.findById<PHOTO_RESULT[]>({
        getAttributes: DEFAULT_PHOTO_FIELDS,
        id: ids,
      });
      const photos = response.data as PHOTO_RESULT[];

      return photos;
    } catch (_) {
      return null;
    }
  }
  /**
   * checks if a user has liked a photo and adds a 'liked' property to the photo object
   * @param photo
   * @param userId
   * @returns
   */
  private static checkLike<T extends PHOTO_RESULT>(photo: T, userId: string) {
    photo.is_liked = photo.likes.users.includes(userId);

    return photo;
  }
  private static convertTags<T extends PHOTO_RESULT | PHOTO_TO_VIEW>(photo: T) {
    photo.tags = Utils.objectToStringArray(photo.tags as object[]);
    return photo;
  }
}

export const DEFAULT_PHOTO_FIELDS = [
  "id",
  "created_at",
  "url",
  "user_id",
  "caption",
  "tags",
  "views",
  "likes",
];
