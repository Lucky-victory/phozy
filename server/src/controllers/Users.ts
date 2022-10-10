import { ALBUM_RESULT } from "./../interfaces/Albums";
import { transformPrivacyToBoolean } from "./../utils/index";
import config from "../config";
import jwt from "jsonwebtoken";
import {
  defaultProfileImage,
  removePropFromObject,
  generateUsername,
} from "../utils";
import { NEW_USER, USER_RESULT } from "../interfaces/Users";

import { NextFunction, Request, Response } from "express";
import { hash as hashPassword, compare as comparePassword } from "bcrypt";
import UsersModel from "../models/Users";
import ms from "ms";
import AlbumsModel from "../models/Albums";
import CacheManager from "../utils/cache-manager";
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
      const [usernameExist, emailExist] = (await Promise.all([
        await UsersModel.findByUsername(emailOrUsername, ["password"]),
        UsersModel.findByEmail(emailOrUsername, ["password"]),
      ])) as [NEW_USER, NEW_USER];

      if (!(usernameExist || emailExist)) {
        res.status(404).json({
          message: "Invalid credentials",
        });
        return;
      }
      const prevPassword = usernameExist?.password
        ? usernameExist?.password
        : emailExist?.password;
      // compare the password to see if it matches
      const isPasswordMatch = await comparePassword(
        String(password),
        prevPassword
      );
      if (!isPasswordMatch) {
        res.status(403).json({
          user: null,
          message: "Invalid credentials",
        });
        return;
      }
      let user = usernameExist ? usernameExist : emailExist;
      // remove password from the object before sending it out to the client
      user = removePropFromObject(user, ["password"]);
      // remove profile image from the object before generating a token from it
      const userToToken = removePropFromObject(user, ["profile_image"]);
      // generate a jwt token
      jwt.sign(
        { user: userToToken },
        config.jwt_secret_key as string,
        (err: unknown, encoded: unknown) => {
          if (err) throw err;
          res.status(200).json({
            message: "login successful",
            user,
            auth: {
              token: encoded as string,
              expiresIn: ms(config.jwt_expiration as string),
            },
          });
        }
      );
    } catch (error) {
      res.status(500).json({
        message: "an error occurred ",
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
  static async createNewUser(req: Request, res: Response): Promise<void> {
    try {
      let { password, username } = req.body;
      const { email, fullname } = req.body;
      username = generateUsername(username);

      // check if user already exist
      const [usernameExist, emailExist] = await Promise.all([
        await UsersModel.findByUsername(username),
        UsersModel.findByEmail(email),
      ]);

      if (usernameExist) {
        res.status(400).json({
          message: "username is already taken",
        });
        return;
      }
      if (emailExist) {
        res.status(400).json({
          message: "user already exist, do you want to login?",
        });
        return;
      }
      password = await hashPassword(String(password), 10);

      const newUser: NEW_USER = {
        email,
        fullname,
        username,
        password,
        profile_image: defaultProfileImage,
      };

      const insertId = (await UsersModel.create(newUser)) as number[];
      // get the newly added user with the id
      const result = (await UsersModel.findById(insertId[0])) as USER_RESULT;
      const user = result;
      // remove profile image from the object before generating a token from it
      const userToToken = removePropFromObject(user as unknown as NEW_USER, [
        "profile_image",
      ]);

      // generate JWT token
      jwt.sign(
        { user: userToToken },
        config.jwt_secret_key as string,
        (err: unknown, encoded: unknown) => {
          if (err) throw err;
          res.status(200).json({
            messsage: "account successfully created ",
            user,
            auth: {
              token: encoded,
              expiresIn: ms(config.jwt_expiration as string),
            },
          });
        }
      );
    } catch (error) {
      res.status(500).json({
        error,
        message: "an error occured",
      });
    }
  }
  static async getUserByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const user = (await UsersModel.findByUsername(username)) as USER_RESULT;
      if (!user) {
        res.status(404).json({
          message: "user does not exist",
        });
        return;
      }
      res.status(200).json({
        message: "user info retrieved",
        data: user,
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
      const { auth } = req;
      let albums;
      const user = (await UsersModel.findByUsername(username)) as USER_RESULT;
      if (!user) {
        res.status(404).json({
          message: "user does not exist",
        });
        return;
      }
      // check if the authenticated user is the same requesting the resource by comparing the user ID
      if (user.id === auth?.user?.id) {
        // if the current user, get both public and private albums
        albums = await AlbumsModel.findByUserIdWithAuth([], auth?.user?.id);

        albums = transformPrivacyToBoolean(albums as ALBUM_RESULT[]);
      } else {
        // otherwise get only public albums
        albums = await AlbumsModel.findByUserId([], user?.id);

        albums = transformPrivacyToBoolean(albums as ALBUM_RESULT[]);
      }
      res.status(200).json({
        message: "user info retrieved",
        data: albums,
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
      await UsersModel.update(
        {
          profile_image: photo_url,
        },
        userId
      );
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
    const user = (await UsersModel.findById(userId)) as USER_RESULT;
    if (!user) {
      res.status(404).json({
        message: "user does not exist",
      });
      return;
    }
    req.user = user;
    next();
  }
}
