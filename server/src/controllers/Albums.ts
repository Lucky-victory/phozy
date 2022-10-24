import { Request, Response } from "express";
import { ALBUM_RESULT, IAlbum } from "../interfaces/Albums";
import { PHOTO_RESULT } from "./../interfaces/Photos";
import { USER_RESULT } from "./../interfaces/Users";
import { Utils } from "./../utils/index";

import { albumsModel } from "../models/Albums";
import { photosModel } from "../models/Photos";
import { usersModel } from "../models/Users";

import { Order } from "harpee";
import CacheManager from "../utils/cache-manager";
import { DEFAULT_PHOTO_FIELDS } from "./Photos";

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
  static async create(req: Request, res: Response): Promise<void> {
    try {
    
      const authUser = Utils.getAuthenticatedUser(req);
      // this will remove any property not specified in Schema fields 
      const bodyData = Utils.pick(req.body, albumsModel.fields);
      const album= {
        ...bodyData,
        user_id: authUser.id,
      };

      // get the inserted id
      const result = await (await albumsModel.create(album)).data;
      // query with the insert id
      const insertedAlbum = await albumsModel.findOne<ALBUM_RESULT>(
        { id: result?.inserted_hashes[0] as string },DEFAULT_ALBUM_FIELDS
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
      const user = Utils.getAuthenticatedUser(req);
     
      // get the fields specified in schema
      const fieldsInSchema = albumsModel.fields;
      const getAttributes = Utils.getFields(fields as string, fieldsInSchema, DEFAULT_ALBUM_FIELDS);
       if (!fieldsInSchema.includes(orderby as string)) orderby = "created_at";

      const recordCountResult = await albumsModel.describeModel<any>();
      const recordCount = recordCountResult.data.record_count;

      if (recordCount - offset <= 0 || offset > recordCount) {
        res.status(200).json({ message: "No more Albums", data: [] });
        return;
      }
     
      const result = await albumsModel.find<ALBUM_RESULT[]>({
       
        getAttributes,
      
      });
      let albums = result.data as ALBUM_RESULT[];
      // get photos in albums
     albums= await Promise.all(albums.map(async (album) => {
        const photosResult = await photosModel.findById<PHOTO_RESULT[]>({
          getAttributes: DEFAULT_PHOTO_FIELDS, id: album.photos as string[]})
          album.photos=photosResult.data as PHOTO_RESULT[]
          return album
      }))
   
   
      
      res.status(200).json({
        message: "albums retrieved",
        data: albums,
     
      });
    } catch (error) {
      console.log(error);
      
      res.status(500).json({
        message: "An error occurred",error
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
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const authUser = Utils.getAuthenticatedUser(req);
     
      const { photoPerPage = 10, page = 1, fields } = req.query;
      const offset = ((page as number) - 1) * (photoPerPage as number);
      // get the fields specified in schema
      const fieldsInSchema = albumsModel.fields;
      const getAttributes = Utils.getFields(fields as string, fieldsInSchema, DEFAULT_ALBUM_FIELDS);

      // const cachedData = albumCache.get<ALBUM_RESULT>("album" + id);
      // if (cachedData) {
      //   res.status(200).json({
      //     message: "album recieved from cache",
      //     data: cachedData,
      //   });

      //   return;
      // }

      const response = await albumsModel.findOne<ALBUM_RESULT>(
        {
          id,
        },
        getAttributes
      );
      const album = response.data;
      if (!album) {
        res.status(404).json({
          message: `Album with '${id}' does not exist`,
        });
        return;
      }
      const hasAccess = Utils.isAuthorized(
        album,
        authUser
      );
      // if the album is private and the current user isn't the owner of the resource
      if (!album.is_public && !hasAccess) {
        res.status(401).json({
          message: "Unauthorized, you don't have access to this resource",
        });
        return;
      }

      // get the user that owns the albums
      const user = await usersModel.findOne<USER_RESULT>({
        id: album.user_id as string,
      });
      // get photos under the albums
      const photos = await photosModel.findById<PHOTO_RESULT[]>({
        id: album.photos as string[],
        getAttributes: DEFAULT_PHOTO_FIELDS,
      });
      console.log(photos);
      
      const data = Object.assign({ ...response.data },
        {
          user: user?.data,
          photos: photos?.data,
        });
      console.log('======');
      
      console.log(data,'album data');
      
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

  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { album_id } = req.params;

       const authUser = Utils.getAuthenticatedUser(req);
      // this will remove any property not specified in Schema fields 
      const bodyData = Utils.pick(req.body, albumsModel.fields);

      const albumToUpdate= {
        ...bodyData,
        updated_at: Utils.currentTime.getTime(),
        id: album_id,
   
      };


      const album = await albumsModel.findOne<ALBUM_RESULT>({ id: album_id });
      if (!album?.data) {
        res.status(404).json({
          message: `Album with '${album_id}' does not exist`,
        });
        return;
      }
      const hasAccess = Utils.isAuthorized(album.data, authUser);
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, you don't have access to this resource",
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
  static async addPhoto(req: Request, res: Response): Promise<void> {
    try {
      const { album_id } = req.params;
      const { photo_id } = req.body;
      const authUser = Utils.getAuthenticatedUser(req);
    
      const album = await albumsModel.findOne<ALBUM_RESULT>({ id: album_id });
      if (!album?.data) {
        res.status(404).json({
          message: `Album with '${album_id}' does not exist`,
        });
        return;
      }
      const hasAccess = Utils.isAuthorized(album.data, authUser);
      if (!hasAccess) {
        res.status(401).json({
          message: "Unauthorized, you don't have access to this resource",
        });
        return;
      }

      const response = await albumsModel.updateNested<ALBUM_RESULT>({
        id: album_id, path: '.photos', getAttributes: DEFAULT_ALBUM_FIELDS, value: (data: IAlbum) => {
          data.updated_at = Utils.currentTime.getTime();
          if (!data.photos.includes(photo_id)) data.photos.push(photo_id);
          return data.photos;
        }
      });

      const albumToView = response.data as ALBUM_RESULT;
      const photosInAlbum = await photosModel.findById<PHOTO_RESULT[]>({ id: albumToView?.photos as string[], getAttributes: DEFAULT_PHOTO_FIELDS });
      albumToView.photos = photosInAlbum.data as PHOTO_RESULT[];
      
      res.status(200).json({data:albumToView,
        message: "photo added to album successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "An error occcurred could't add photo to album",
        error,
      });
    }
  }
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { album_id } = req.params;
      const { auth } = req;
      const userId = auth?.user?.id;
      const albumId = parseInt(album_id, 10);

      const album = await albumsModel.findOne<ALBUM_RESULT>({ id: albumId });
      if (!album?.data) {
        res.status(404).json({
          message: `Album with '${album_id}' was not found`,
        });
        return;
      }
      const hasAccess = Utils.isAuthorized(album?.data, auth?.user);
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

export const DEFAULT_ALBUM_FIELDS = ["id", "description", "title", "created_at", "user_id", "is_public", "photos"];