import randomWords from "random-words";
import slugify from "slugify";
import { ALBUM_RESULT } from "../interfaces/Albums";
import { AuthUser } from "../interfaces/common";
import { ILikesResult } from "../interfaces/Likes";
import { PHOTO_RESULT } from "../interfaces/Photos";
import { NEW_USER } from "../interfaces/Users";

export const removePropFromObject = (
  obj: NEW_USER,
  props: string[]
): NEW_USER => {
  for (const prop of props) {
    obj[prop as keyof NEW_USER] ? delete obj[prop as keyof NEW_USER] : null;
  }
  return obj as NEW_USER;
};

export const defaultProfileImage =
  "https://images.pexels.com/photos/3494648/pexels-photo-3494648.jpeg?auto=compress&cs=tinysrgb&w=640&h=854&dpr=2";

/**
 * Check if the authenticated user is the owner of the resource
 * @param resource
 * @param user
 * @returns
 */
export const isAuthorized = (
  resource: ALBUM_RESULT | PHOTO_RESULT | ILikesResult,
  user: AuthUser["user"]
): boolean => {
  if (resource && user) {
    return resource?.user_id === user?.id;
  }
  return false;
};

/**
 * Generate a random username if no username is provided
 * @param username
 */
export const generateUsername = (name?: string): string => {
  let username = name;
  username ? username : randomWords({ exactly: 2, maxLength: 8, join: "-" });
  // transform the username into a lowercase slug
  username = slugify(username as string);
  return username;
};

/**
 * @desc Moves object properties and nest them under a new property
 * @param obj - the object to transform
 * @param options - an object with the title for the nested property and properties to be nested
 * @returns
 */
export const nestObjectProps = (
  obj: { [key: string]: unknown },
  options: { nestedTitle: string; props: string[] }
) => {
  const newObj: { [key: string]: unknown } = {};
  const nestedObj: { [key: string]: unknown } = {};
  const propsToNestObj: { [key: string]: unknown } = {};

  for (const prop of options.props) {
    propsToNestObj[prop] = true;
  }

  for (const key in obj) {
    if (
      propsToNestObj[key] ||
      !Object.prototype.hasOwnProperty.call(obj, key)
    ) {
      nestedObj[key] = obj[key];
      continue;
    }
    newObj[key] = obj[key];
  }
  newObj[options.nestedTitle] = nestedObj;
  return newObj;
};

/**
 * Checks if a value is an empty string or undefined
 * @param val
 * @returns
 */
export const isEmpty = (val: unknown): boolean => {
  if (String(val).trim() === "" || typeof val === "undefined") return true;
  return false;
};
