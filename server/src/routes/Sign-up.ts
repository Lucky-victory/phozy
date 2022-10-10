import { Router } from "express";
import UsersController from "../controllers/Users";
const router = Router();
import asyncHandler from "express-async-handler";
import Validators from "../middlewares/validators";

router.post(
  "/",
  Validators.validateSignUp(),
  Validators.validationResult,
  asyncHandler(UsersController.createNewUser)
);

export default router;
