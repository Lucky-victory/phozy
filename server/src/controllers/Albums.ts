
import { PHOTO_RESULT } from "./../interfaces/Photos";
import { USER_RESULT } from "./../interfaces/Users";
import { isAuthorized, Utils } from "./../utils/index";
import { IAlbum, ALBUM_RESULT, NEW_ALBUM } from "../interfaces/Albums";
import { Request, Response } from "express";

import { albumsModel } from "../models/Albums";
import { usersModel } from "../models/Users";
import { photosModel } from "../models/Photos";

import CacheManager from "../utils/cache-manager";

const albumCache = new CacheManager();

export default class AlbumsController {
  /**
   * @desc Creates a new album
   * @route POST /api/albums/
   *
   * @param req
   * @param res
   * @returns
   */
  static async createNewAlbum(req: Request, res: Response): Promise<void> {
    try {
      const { auth } = req;
      const { title, is_public, description } = req.body;

      const album: NEW_ALBUM = {
        title,
        description,
        is_public,
        user_id: auth?.user?.id,
      };

      // get the insert id
      const result = await albumsModel.create(album);
      // query with the insert id
      const insertedAlbum = await albumsModel.findOne<ALBUM_RESULT>(
        { id: result.data?.inserted_hashes[0] as string },
        ["id", "description", "title", "created_at", "user_id", "is_public"]
      );
      const data = insertedAlbum?.data;

      res.status(201).json({
        message: "album successfully created",
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "an error occurred,couldn't create album",
        error,
      });
    }
  }
  /**
   * @desc get public albums or private albums when user is authenticated
   * @route GET /api/albums/
   * @param req
   * @param res
   */
  static async getAlbums(req: Request, res: Response) {
    try {
      const { page = 1, perPage = 10, fields } = req.query;

      const { user } = req;
      const offset =
        (parseInt(page as string) - 1) * parseInt(perPage as string);
      // get the fields specified in schema
      const fieldsInSchema = albumsModel.fields;
      const getAttributes = Utils.getFields(fields as string, fieldsInSchema);

      const albums = await albumsModel.find<ALBUM_RESULT[]>({
        limit: perPage as number,
        offset,
        getAttributes,
        where: `is_public=${Utils.isEmpty(user)}`,
      });

      res.status(200).json({
        message: "albums retrieved",
        data: albums,
        total: albums?.data?.length,
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occurred",
      });
    }
  }
  /**
   * @desc Retrieves an album by id
   * @route GET /api/albums/:album_id
   * @param req
   * @param res
   * @returns
   */
  static async getAlbumById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { auth } = req;
      const albumId = id;
      const { maxPhoto = 10, page = 1, fields } = req.query;
      const offset = ((page as number) - 1) * (maxPhoto as number);
      // get the fields specified in schema
      const fieldsInSchema = albumsModel.fields;
      const getAttributes = Utils.getFields(fields as string, fieldsInSchema);

      const cachedData = albumCache.get<ALBUM_RESULT>("album" + id);
      if (cachedData) {
        res.status(200).json({
          message: "album recieved from cache",
          data: cachedData,
        });

        return;
      }

      const album = await albumsModel.findOne<ALBUM_RESULT>(
        {
          id,
        },
        getAttributes
      );

      if (Utils.isEmpty(album?.data)) {
        res.status(404).json({
          message: `Album with '${id}' was not found`,
        });
        return;
      }
      const hasAccess = isAuthorized(album?.data as ALBUM_RESULT, auth?.user);
      // if the album is private and the current user isn't the owner of the resource
      if (!album?.data?.is_public && !hasAccess) {
        res.status(401).json({
          message: "Unauthorized, don't have access to this resource",
        });
        return;
      }

      // get the user that owns the albums
      const user = await usersModel.findOne<USER_RESULT>({
        id: album?.data?.user_id as string,
      });
      // get photos under the albums
      const photos = await photosModel.find<PHOTO_RESULT[]>({
        limit: maxPhoto as number,
        offset,
      });
      const data = {
        ...album.data,
        user: user?.data,
        photos: photos?.data,
      };
      albumCache.set("album" + id, data);
      res.status(201).json({
        message: "album retrieved",
        data,
      });
    } catch (error) {
      res.status(500).json({
        message: "an error occurred",
        error,
      });
    }
  }

  static async updateAlbum(req: Request, res: Response): Promise<void> {
    try {
      const { album_id } = req.params;
      const { auth } = req;
      const userId = auth?.user?.id;

      const albumId = album_id;
      // an album record to be updated
      const albumToUpdate: IAlbum = {
        updated_at: Utils.currentTime.getTime(),
        id: albumId,
        ...req.body,
      };

      const album = await albumsModel.findOne<ALBUM_RESULT>({ id: albumId });
      if (!album?.data) {
        res.status(404).json({
          message: `Album with '${album_id}' was not found`,
        });
        return;
      }
      const hasAccess = isAuthorized(album.data, auth?.user);
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, don't have access to this resource",
        });
        return;
      }

      await albumsModel.update([albumToUpdate]);

      res.status(200).json({
        message: "album successfully updated",
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcurred",
        error,
      });
    }
  }
  static async deleteAlbum(req: Request, res: Response): Promise<void> {
    try {
      const { album_id } = req.params;
      const { auth } = req;
      const userId = auth?.user?.id;
      const albumId = parseInt(album_id, 10);

      const album = await albumsModel.findOne<ALBUM_RESULT>({id:albumId});
      if (!album?.data) {
        res.status(404).json({
          message: `Album with '${album_id}' was not found`,
        });
        return;
      }
      const hasAccess = isAuthorized(album?.data, auth?.user);
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, don't have access to this resource",
        });
        return;
      }
      await albumsModel.findByIdAndRemove([albumId]);
      res.status(200).json({
        message: "album successfully deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcurred",
        error,
      });
    }
  }

  private async albumExist(
    id: string
  ): Promise<[ALBUM_RESULT | null, unknown | null]> {
    try {
      const result = await albumsModel.findOne<ALBUM_RESULT>({
        id,
      });
      return [result?.data, null];
    } catch (error) {
      return [null, error];
    }
  }
}
