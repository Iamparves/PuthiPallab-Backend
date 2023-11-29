import { Router } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import { getOverview } from "../controllers/overviewController.js";

const router = Router();

router.route("/").get(protect, restrictTo("librarian"), getOverview);

export default router;
