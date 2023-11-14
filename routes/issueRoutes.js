import { Router } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  getAllIssues,
  issueBook,
  returnBook,
} from "../controllers/issueController.js";

const router = Router();

router.use(protect, restrictTo("librarian"));

router.route("/").get(getAllIssues).post(issueBook).patch(returnBook);

export default router;
