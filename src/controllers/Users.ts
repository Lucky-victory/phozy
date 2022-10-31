import jwt from "jsonwebtoken";
import config from "../env-config";
import { NEW_USER, USER_AUTH, USER_RESULT } from "../interfaces/Users";
import { defaultProfileImage, Utils } from "../utils";

import { compare as comparePassword, hash as hashPassword } from "bcrypt";
import { NextFunction, Request, Response } from "express";
import ms from "ms";
import { albumsModel } from "../models/Albums";
import { usersModel } from "../models/Users";
import CacheManager from "../utils/cache-manager";
import { photosModel } from "../models/Photos";
import { PHOTO_RESULT } from "../interfaces/Photos";
import PhotosController, { DEFAULT_PHOTO_FIELDS } from "./Photos";
import { DEFAULT_ALBUM_FIELDS } from "./Albums";
import { ALBUM_RESULT } from "../interfaces/Albums";
const userCache = new CacheManager();

export default class UsersController {
  /**
   * Login an existing user
   * @param req
   * @param res
   * @returns
   */
  static async logInUser(req: Request, res: Response): Promise<void> {
    try {
      const emailOrUsername = req.body.email_or_username;
      const { password } = req.body;

      // check if user exist by username or email
      const [usernameExist, emailExist] = await Promise.all([
        await usersModel.findOne<USER_AUTH>(
          { email: emailOrUsername },
          AUTH_USER_FIELDS
        ),
        await usersModel.findOne<USER_AUTH>(
          { username: emailOrUsername },
          AUTH_USER_FIELDS
        ),
      ]);

      if (!(usernameExist.data || emailExist.data)) {
        res.status(400).json({
          message: "Invalid credentials",
        });
        return;
      }
      const prevPassword = usernameExist.data?.password
        ? usernameExist.data?.password
        : emailExist.data?.password;
      // compare the password to see if it matches
      const isPasswordMatch = await comparePassword(
        String(password),
        prevPassword as string
      );
      if (!isPasswordMatch) {
        res.status(400).json({
          user: null,
          message: "Invalid credentials",
        });
        return;
      }
      let user = usernameExist.data ? usernameExist.data : emailExist.data;
      // remove password from the object before sending it out to the client
      user = Utils.omit(user as USER_AUTH, ["password"]) as USER_AUTH;

      // // remove profile image from the object before generating a token from it
      const userToToken = Utils.omit(user as USER_AUTH, ["profile_image"]);
      // generate a jwt token
      jwt.sign(
        { user: userToToken },
        config.jwt_secret_key as string,
        (err: unknown, encoded: unknown) => {
          if (err) throw err;
          res.status(200).json({
            message: "login successful",
            data: {
              user,
              auth: {
                token: encoded as string,
                expiresIn: ms(config.jwt_expiration as string),
              },
            },
          });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "an error occurred While logging in",
        error,
      });
    }
  }
  /**
   * Add new user
   * @param req
   * @param res
   * @returns
   */
  static async addNewUser(req: Request, res: Response): Promise<void> {
    try {
      let { password } = req.body;
      const { email, fullname } = req.body;
      const shortId = Utils.shortID(8);

      // check if user already exist
      const emailExist = await usersModel.findOne({ email });
      // const [usernameExist, emailExist] = await Promise.all([
      //   await usersModel.findOne({ username }),
      //   await usersModel.findOne({ email }),
      // ]);

      // if (usernameExist.data) {
      //   res.status(400).json({
      //     message: "username is already taken",
      //   });
      //   return;
      // }
      if (emailExist.data) {
        res.status(400).json({
          message: "user already exist, do you want to login?",
        });
        return;
      }
      const username = Utils.generateUsername(fullname, "", shortId);
      password = await hashPassword(String(password), 10);

      const newUser: NEW_USER = {
        email,
        fullname,
        username,
        password,
        profile_image: defaultProfileImage,
      };

      const insertId = await usersModel.create(newUser);
      // get the newly added user with the id
      const result = await usersModel.findOne<USER_RESULT>(
        {
          id: insertId.data?.inserted_hashes[0] as string,
        },
        DEFAULT_USER_FIELDS
      );
      const user = result.data;
      // remove profile image from the object before generating a token from it
      const userToToken = Utils.omit(user as USER_RESULT, [
        "profile_image",
        "socials",
      ]);

      // generate JWT token
      jwt.sign(
        { user: userToToken },
        config.jwt_secret_key as string,
        (err: unknown, encoded: unknown) => {
          if (err) throw err;
          res.status(200).json({
            messsage: "account successfully created ",
            data: {
              user,
              auth: {
                token: encoded,
                expiresIn: ms(config.jwt_expiration as string),
              },
            },
          });
        }
      );
    } catch (error) {
      console.log(error);

      res.status(500).json({
        error,
        message: "an error occured",
      });
    }
  }
  static async getUserByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const user = await usersModel.findOne<USER_RESULT>(
        { username },
        DEFAULT_USER_FIELDS
      );
      if (!user.data) {
        res.status(404).json({
          message: "user does not exist",
          data: null,
        });
        return;
      }
      res.status(200).json({
        message: "user info retrieved",
        data: user.data,
      });
    } catch (error) {
      res.status(500).json({
        message: "an error occurred",
        error,
      });
    }
  }
  static async getAlbumsByUser(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const authUser = Utils.getAuthenticatedUser(req);

      const user = await usersModel.findOne<USER_RESULT>({ username });
      if (!user.data) {
        res.status(404).json({
          message: "user does not exist",
          data: null,
        });
        return;
      }
      // checks if the authnticated user is the same user requesting for the resource
      const isSameUser = UsersController.isCurrentUser(authUser, user.data?.id);

      const response = await albumsModel.find<ALBUM_RESULT[]>({
        getAttributes: DEFAULT_ALBUM_FIELDS,
        where: `user_id="${user.data?.id}" ${
          !isSameUser ? "AND is_public=true" : ""
        }`,
      });
      let albums = response.data as ALBUM_RESULT[];

      albums = await Promise.all(
        albums.map(async (album) => {
          album.photos = (await PhotosController.getByIds(
            album.photos as string[]
          )) as PHOTO_RESULT[];
          return album;
        })
      );

      res.status(200).json({
        message: "albums retrieved successfully",
        data: albums,
      });
    } catch (error) {
      res.status(500).json({
        message: "an error occurred",
        error,
      });
    }
  }

  static async getPhotosByUser(req: Request, res: Response) {
    try {
      const { username } = req.params;

      const user = await usersModel.findOne<USER_RESULT>({ username });
      if (!user.data) {
        res.status(404).json({
          message: "user does not exist",
          data: null,
        });
        return;
      }

      const photos = await photosModel.find<PHOTO_RESULT[]>({
        getAttributes: DEFAULT_PHOTO_FIELDS,
        where: `user_id="${user.data?.id}"`,
      });

      res.status(200).json({
        message: "photos retrieved successfully",
        data: photos.data,
      });
    } catch (error) {
      res.status(500).json({
        message: "an error occurred",
        error,
      });
    }
  }
  static async updateProfileImage(req: Request, res: Response) {
    const { photo_url, user } = req;
    const userId = user.id;
    try {
      // await usersModel.update(
      //   {
      //     // profile_image: photo_url,
      //   },
      //   userId
      // );
    } catch (error) {
      res.status(500).json({
        message: "an error occured, couldn't update profile image",
      });
    }
  }
  static async checkIfUserExist(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { auth } = req;
    const userId = auth?.user?.id;
    const user = await usersModel.findOne<USER_RESULT>({ id: userId });
    if (!user) {
      res.status(404).json({
        message: "user does not exist",
      });
      return;
    }
    req.user = user?.data as USER_RESULT;
    next();
  }
  private static isCurrentUser(authUser: USER_RESULT, userId: string): boolean {
    return authUser?.id === userId;
  }
}
export const DEFAULT_USER_FIELDS = [
  "id",
  "profile_image",
  "fullname",
  "username",
  "socials",
];

export const AUTH_USER_FIELDS = [
  "password",
  "id",
  "fullname",
  "username",
  "profile_image",
];
