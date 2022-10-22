import { MyUtils } from "my-node-ts-utils";
import randomWords from "random-words";
import { ALBUM_RESULT } from "../interfaces/Albums";
import { AuthUser } from "../interfaces/common";
import { PHOTO_RESULT } from "../interfaces/Photos";
import isEmpty from "just-is-empty";
import omit from "just-omit";
import pick from "just-pick";
import merge from "just-merge";
import values from "just-values";
import slugify from "slugify";
import { Request } from "express";
export const defaultProfileImage =
  "https://images.pexels.com/photos/3494648/pexels-photo-3494648.jpeg?auto=compress&cs=tinysrgb&w=640&h=854&dpr=2";

export class Utils extends MyUtils {
  constructor() {
    super();
  }
  /**
   * Check if the authenticated user is the owner of the resource
   * @param resource
   * @param user
   * @returns
   */
  static isAuthorized = (
    resource: ALBUM_RESULT | PHOTO_RESULT,
    user: AuthUser["user"]
  ): boolean => {
    if (resource && user) {
      return resource?.user_id === user?.id;
    }
    return false;
  };
  static values() {
    // return values();
  }
  static shortID(length = 8) {
    return Math.random().toString(16).substring(2, length);
  }
  static generateSlug(caption?: string, prefix = "phozy_") {
    if (Utils.isEmpty(caption)) return `${prefix}${Utils.generateID()}`;

    return (
      slugify(caption as string, {
        strict: true,
        lower: true,
      }) + Utils.shortID()
    );
  }
  static getAuthenticatedUser(req:Request) {
    return req.auth.user
  }
  /**
   * Generates a short username, if no name is provided
   */
  static generateUsername(name?: string, prefix = "", suffix = ""): string {
    const username = name
      ? name
      : randomWords({ exactly: 2, maxLength: 8, join: "_" });

    return prefix + username + suffix;
  }
  static getFields(
    queryFields: string,
    schemaFields: string[],
    defaultFields = ["*"]
  ) {
    if (Utils.isEmpty(queryFields)) return defaultFields;
    let fields = queryFields.split(",");
    fields = fields.filter((field) => {
      if (schemaFields.includes(field)) return field;
    });
    return fields;
  }
  static stringToObjectArray(text: string, propTitle = "title") {
    if (Utils.isEmpty(text.trim())) return [];
    const _text = text.split(",");

    const textToObject = _text.map((str) => {
      return {
        [propTitle]: str,
      };
    });

    return textToObject;
  }
  static isEmpty(val: any) {
    return isEmpty(val);
  }
  static merge<T extends object, O extends object[]>(obj: T, ...objs: O) {
    return merge(obj, ...objs);
  }
  static omit<T extends object>(obj: T | T[], remove: (keyof T)[] | string[]) {
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return omit(item, remove as (keyof T)[]);
      });
    }
    return omit(obj, remove as (keyof T)[]);
  }
  static pick<T extends object>(obj: T | T[], select: (keyof T)[] | string[]) {
    if (Array.isArray(obj)) {
      return obj.map((item) => {
        return pick(item as T, select as (keyof T)[]);
      });
    }
    return pick(obj, select as (keyof T)[]);
  }
}
