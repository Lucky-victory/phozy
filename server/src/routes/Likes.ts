import { Router } from "express";
import asyncHandler from "express-async-handler";
import LikesController from "../controllers/Likes";
import { checkIfAuthenticated } from "../middlewares/Auth";
const router = Router();

router.use(checkIfAuthenticated);
router.post("/like/:photo_id", asyncHandler(LikesController.addLike));
router.post("/unlike/:photo_id", asyncHandler(LikesController.removeLike));

export default router;
