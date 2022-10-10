import { NextFunction, Request, Response } from "express";
import { check, ValidationError, validationResult } from "express-validator";
import path from "path";

export default class Validators {
  static validateSignUp() {
    return [
      check("fullname")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Name is required!")
        .isString()
        .withMessage("Must be a valid name!")
        .isLength({ min: 3, max: 20 })
        .withMessage("Name must be within 3 to 20 character!"),
      check("username")
        .trim()
        .not()
        .isEmpty()
        .isString()
        .withMessage("Username is required")
        .isLength({ min: 4, max: 20 })
        .withMessage("Username must be within 3 to 20 character!")
        .matches(/[a-z0-9]/g)
        .withMessage("Username must be alpha-numeric"),
      check("email").normalizeEmail().isEmail().withMessage("Invalid email!"),
      check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("Password is empty!")
        .isLength({ min: 6, max: 20 })
        .withMessage("Password must be 6 to 20 characters long!")
        .matches(/\d/)
        .withMessage(" Must contain at least one digit")
        .matches(/[A-Z]/)
        .withMessage("Must contain at least one capital letter"),
      check("confirm_password")
        .trim()
        .not()
        .isEmpty()
        .custom((value: string, { req }) => {
          if (value !== req.body.password) {
            throw new Error("Both password must be same!");
          }
          return true;
        }),
    ];
  }
  static validateSignIn() {
    return [
      check("email_or_username")
        .trim()
        .not()
        .isEmpty()
        .withMessage("email / username and  password is required!"),
      check("password")
        .trim()
        .not()
        .isEmpty()
        .withMessage("email / username and password is required!"),
    ];
  }

  static validateAlbumAdd() {
    return [
      check("title")
        .trim()
        .not()
        .isEmpty()
        .withMessage("title is required!")
        .isString()
        .withMessage("Must be a string")
        .isLength({ min: 3, max: 20 })
        .withMessage("title must be within 3 to 20 character!"),
      check("privacy").isBoolean().withMessage("privacy must be a boolean "),
    ];
  }
  static validationResult(req: Request, res: Response, next: NextFunction) {
    let results = validationResult(req).array() as ValidationError[];

    if (!results.length) {
      return next();
    }
    results = results.map((result) => {
      return {
        value: result.value,
        message: result.msg,
        param: result.param,
      };
    }) as unknown as ValidationError[];

    res.status(400).json({
      errors: results,
    });
  }
}
