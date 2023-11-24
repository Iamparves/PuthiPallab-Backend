import { Router } from "express";
import { protect, restrictTo } from "../controllers/authController.js";
import {
  getAllIssues,
  getIssue,
  issueBook,
  returnBook,
} from "../controllers/issueController.js";

const router = Router();

router.get("/myissues", protect, restrictTo("member"), getAllIssues);

router.use(protect, restrictTo("librarian"));

router.route("/").get(getAllIssues).post(issueBook).patch(returnBook);

router.route("/:bookId/:userId").get(getIssue);

export default router;
