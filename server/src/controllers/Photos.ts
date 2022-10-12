import { isAuthorized } from "./../utils/index";

import { NextFunction, Request, Response } from "express";
import { photosModel } from "../models/Photos";
import { IPhoto, NEW_PHOTO, PHOTO_RESULT } from "./../interfaces/Photos";
import { albumsModel } from "../models/Albums";

export default class PhotosController {
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

      const newPhotos: NEW_PHOTO[] = photo_urls.map((photo_url) => {
        return {
          url: photo_url,
          tags: [] as string[],
          caption: "",
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
      const hasAccess = isAuthorized(photo.data as PHOTO_RESULT, auth.user);
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

  /**
   check if an album with the specified id exist
   * 
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  // static async checkIfAlbumExist(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) {
  //   const { album_id } = req.params;
  //   const { auth } = req;
  //   const albumId = parseInt(album_id, 10);
  //   const albumExist = await albumsModel.findById([albumId]);
  //   if (!albumExist.data) {
  //     res.status(404).json({
  //       message: `album with id '${album_id}' does not exist`,
  //     });
  //     return;
  //   }

  //   const hasAccess = isAuthorized(albumExist.data , auth.user);
  //   if (!hasAccess) {
  //     res.status(401).json({
  //       message: "Unauthorized, don't have access to this resource",
  //     });
  //     return;
  //   }
  //   req.album = albumExist;
  //   next();
  // }
}
