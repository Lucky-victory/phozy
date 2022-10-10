import UsersController from "../controllers/Users";
import asyncHandler from "express-async-handler";
import { Router } from "express";
import Validators from "../middlewares/validators";
const router = Router();

router.post(
  "/",
  Validators.validateSignIn(),
  Validators.validationResult,
  asyncHandler(UsersController.logInUser)
);

export default router;
