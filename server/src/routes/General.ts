import { Router } from "express";
import asyncHandler from "express-async-handler";
import GeneralController from "../controllers/General";
import { checkIfAuthenticatedOptional } from "../middlewares/Auth";
const router = Router();

router.get(
  "/",
  asyncHandler(GeneralController.find)
);

export default router;
