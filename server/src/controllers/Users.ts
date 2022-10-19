import { ALBUM_RESULT } from "./../interfaces/Albums";
import config from "../config";
import jwt from "jsonwebtoken";
import { defaultProfileImage, Utils } from "../utils";
import { IUser, NEW_USER, USER_AUTH, USER_RESULT } from "../interfaces/Users";

import { NextFunction, Request, Response } from "express";
import { hash as hashPassword, compare as comparePassword } from "bcrypt";
import { usersModel } from "../models/Users";
import ms from "ms";
import { albumsModel } from "../models/Albums";
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
      const [usernameExist, emailExist] = await Promise.all([
        await usersModel.findOne<USER_AUTH>({ email: emailOrUsername }, [
          "password",
          "id",
          "fullname",
          "username",
        ]),
        await usersModel.findOne<USER_AUTH>({ username: emailOrUsername }, [
          "password",
          "id",
          "fullname",
          "username",
        ]),
      ]);

      if (!(usernameExist.data || emailExist.data)) {
        res.status(404).json({
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
        res.status(403).json({
          user: null,
          message: "Invalid credentials",
        });
        return;
      }
      let user = usernameExist.data ? usernameExist.data : emailExist.data;
      // remove password from the object before sending it out to the client
      user = Utils.omit(user as USER_AUTH, ["password"]) as USER_AUTH;

      // // remove profile image and password from the object before generating a token from it
      const userToToken = Utils.omit(user as USER_AUTH, ["profile_image"]);
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
  static async addNewUser(req: Request, res: Response): Promise<void> {
    try {
      let { password } = req.body;
      const { email, fullname } = req.body;
      const shortId = Utils.shortID(7);
      const username = Utils.generateUsername(undefined, "", shortId);

      // check if user already exist
      const [usernameExist, emailExist] = await Promise.all([
        await usersModel.findOne({ username }),
        await usersModel.findOne({ email }),
      ]);

      if (usernameExist.data) {
        res.status(400).json({
          message: "username is already taken",
        });
        return;
      }
      if (emailExist.data) {
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

      const insertId = await usersModel.create(newUser);
      // get the newly added user with the id
      const result = await usersModel.findOne<USER_RESULT>(
        {
          id: insertId.data?.inserted_hashes[0] as string,
        },
        ["id", "profile_image", "fullname", "username"]
      );
      const user = result.data;
      // remove profile image from the object before generating a token from it
      const userToToken = Utils.omit(user as USER_RESULT, ["profile_image"]);

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
      const user = (await usersModel.findOne)<USER_RESULT>({ username });
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
      const user = await usersModel.findOne<USER_RESULT>({ username });
      if (!user.data) {
        res.status(404).json({
          message: "user does not exist",
        });
        return;
      }
      // check if the authenticated user is the same requesting the resource by comparing the user ID
      if (user.data.id === auth?.user?.id) {
        // if the current user, get both public and private albums
        albums = await albumsModel.findById([auth?.user?.id]);
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
}
