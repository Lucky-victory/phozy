import { expressjwt } from "express-jwt";
import config from "../config";

/**
 * Validate the authorization token
 */
export const checkIfAuthenticated = expressjwt({
  secret: config.jwt_secret_key,
  algorithms: ["HS256"],
});

/**
 * Validate the authorization token optional
 */
export const checkIfAuthenticatedOptional = expressjwt({
  secret: config.jwt_secret_key,
  algorithms: ["HS256"],
  credentialsRequired: false,
});
