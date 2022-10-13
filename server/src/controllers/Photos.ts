import { Utils } from "./../utils/index";

import { NextFunction, Request, Response } from "express";
import { photosModel } from "../models/Photos";
import { IPhoto, NEW_PHOTO, PHOTO_RESULT } from "./../interfaces/Photos";
import { albumsModel } from "../models/Albums";
import { Order } from "harpee";

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
      const getAttributes = Utils.getFields(fields as string, fieldsInSchema);
      if (!fieldsInSchema.includes(orderby as string)) orderby = "created_at";

      const photos = await photosModel.find<PHOTO_RESULT[]>({
        getAttributes,
        limit: perPage,
        offset,
        orderby: [orderby as string],
        order: sort as Order,
      });

      res.status(200).json({ message: "photos retrieved", data: photos.data });
    } catch (_) {
      console.log(_);

      res.status(500).json({
        message: "an error occured",
      });
    }
  }
  /**
   * @desc adds new photos to an album
   * @route POST /api/photos/:album_id
   * @param req
   * @param res
   * @returns
   */
  static async addNewPhotos(req: Request, res: Response) {
    try {
      const { photo_urls, auth } = req;
      console.log(photo_urls, "in controller");

      const newPhotos: NEW_PHOTO[] = photo_urls.map((photo) => {
        return {
          url: photo.url,
          caption: photo.caption,
          tags: photo.tags?.split(","),
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
   * @route DELETE /api/photos/:photo_id
   * @param req
   * @param res
   * @returns
   */
  static async deleteItem(req: Request, res: Response) {
    try {
      const { auth } = req;
      const { photo_id } = req.params;
      const photoId = parseInt(photo_id, 10);
      const photo = await photosModel.findById<PHOTO_RESULT>([photoId]);
      if (!photo.data) {
        res
          .status(404)
          .json({ message: `photo with id '${photo_id}' does no exist` });
        return;
      }
      const hasAccess = Utils.isAuthorized(
        photo.data as PHOTO_RESULT,
        auth.user
      );
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, don't have access to this resource",
        });
        return;
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occcured",
        error,
      });
    }
  }
}
