import { PHOTO_RESULT } from "./../interfaces/Photos";
import { USER_RESULT } from "./../interfaces/Users";
import { isAuthorized } from "./../utils/index";
import { IAlbum, ALBUM_RESULT, NEW_ALBUM } from "../interfaces/Albums";
import { Request, Response } from "express";
import { IHarpeeResponse, IHarperDBInsertResponse } from "harpee";
import { albumsModel } from "../models/Albums";
import { usersModel } from "../models/Users";
import { photosModel } from "../models/Photos";

import CacheManager from "../utils/cache-manager";
import { MyUtils } from "my-node-ts-utils";
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
      const result = (await albumsModel.create(
        album
      )) as IHarpeeResponse<IHarperDBInsertResponse>;
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
      const { page = 1, perPage = 10 } = req.query;
      const { user } = req;
      const offset =
        (parseInt(page as string) - 1) * parseInt(perPage as string);

      const albums = await albumsModel.find<ALBUM_RESULT[]>({
        limit: perPage,
        offset,
        getAttributes: [
          "id",
          "title",
          "description",
          "created_at",
          "user_id",
          "is_public",
        ],
        where: `is_public=${MyUtils.isEmpty(user)}`,
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
      const { perPage = 10, page = 1 } = req.query;
      let album;
      const cachedData = albumCache.get<ALBUM_RESULT>("album" + id);
      if (cachedData) {
        res.status(200).json({
          message: "album recieved from cache",
          data: cachedData,
        });

        return;
      }
      if (auth?.user) {
        album = await albumsModel.findOne({
          id,
        });
      } else {
        album = await albumsModel.findById(albumId);
      }
      if (!album) {
        res.status(404).json({
          message: `Album with '${id}' was not found`,
        });
        return;
      }
      const hasAccess = isAuthorized(album, auth?.user);
      // if the album is private and the current user isn't the owner of the resource
      if (album?.privacy && !hasAccess) {
        res.status(401).json({
          message: "Unauthorized, don't have access to this resource",
        });
        return;
      }

      // get the user that owns the albums
      const user = (await usersModel.findById(album.user_id)) as USER_RESULT;
      // get photos under the albums
      const photos = (await photosModel.findById([albumId])) as PHOTO_RESULT;
      const data = {
        ...album,
        user,
        photos,
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
      const { title, description, privacy } = req.body;

      const albumId = parseInt(album_id, 10);
      // an album record to be updated
      let albumToUpdate: ALBUM_RESULT = {
        updated_at: db.fn.now(6) as unknown as string,
        user_id: userId,
        title,
        description,
      };
      // if privacy is not undefined, add it as a property
      privacy ? (albumToUpdate["privacy"] = privacy) : null;

      console.log(albumToUpdate);
      albumToUpdate = transformPrivacyToNumber(albumToUpdate) as ALBUM_RESULT;
      console.log(albumToUpdate);
      const album = await albumsModel.findByIdWithAuth(albumId);
      if (!album) {
        res.status(404).json({
          message: `Album with '${album_id}' was not found`,
        });
        return;
      }
      const hasAccess = isAuthorized(album, auth?.user);
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, don't have access to this resource",
        });
        return;
      }

      await albumsModel.updateAlbum(albumToUpdate, albumId, userId);

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

      const album = await albumsModel.findById(albumId);
      if (!album) {
        res.status(404).json({
          message: `Album with '${album_id}' was not found`,
        });
        return;
      }
      const hasAccess = isAuthorized(album, auth?.user);
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, don't have access to this resource",
        });
        return;
      }
      await albumsModel.deleteAlbum(albumId, userId);
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
      return [result?.data as ALBUM_RESULT, null];
    } catch (error) {
      return [null, error];
    }
  }
}
