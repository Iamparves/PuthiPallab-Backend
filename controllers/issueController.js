import Book from "../models/bookModel.js";
import Issue from "../models/issueModel.js";
import APIFeatures from "../utils/apiFeatures.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import {
  notifyUserIfAvailable,
  removeUserFromWaitlist,
} from "./waitlistController.js";

export const getAllIssues = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Issue.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const issues = await features.query;

  res.status(200).json({
    status: "success",
    results: issues.length,
    data: {
      issues,
    },
  });
});

export const issueBook = catchAsync(async (req, res, next) => {
  const { user, book, issueDate, estimatedReturnDate } = req.body;

  // 1) Check if user already borrowed this book
  const existingIssue = await Issue.findOne({ user, book, status: "issued" });

  if (existingIssue) {
    return next(new AppError("This book is already issued to this user", 400));
  }

  // 2) Check if book is available
  const bookData = await Book.findById(book);

  if (!bookData || bookData.availableCopies === 0) {
    return next(new AppError("This book is not available", 400));
  }

  // 3) Check if user already borrowed 3 books
  const userIssues = await Issue.find({ user, status: "issued" });

  if (userIssues.length >= 3) {
    return next(new AppError("You have already borrowed 3 books", 400));
  }

  // 4) Create new issue
  const issue = await Issue.create({
    user,
    book,
    issueDate,
    estimatedReturnDate,
    status: "issued",
  });

  // 5) Update book data
  bookData.availableCopies -= 1;
  bookData.borrowCount += 1;
  await bookData.save();

  // 6) Remove user from waitlist if exists
  await removeUserFromWaitlist(user, book);

  res.status(201).json({
    status: "success",
    data: {
      issue,
    },
  });
});

export const returnBook = catchAsync(async (req, res, next) => {
  const { user, book, returnDate, delayedFine } = req.body;

  // 1) Check if issues exists and update it
  const issue = await Issue.findOneAndUpdate(
    { user, book, status: "issued" },
    { returnDate, delayedFine, status: "returned" },
    { new: true }
  );

  // 2) If no issue exists, return error
  if (!issue) {
    return next(new AppError("No such issue exists", 404));
  }

  // 3) Update book data
  const bookData = await Book.findById(book);
  bookData.availableCopies += 1;
  await bookData.save();

  // 4) Check if waiting user should be notified (if any)
  if (bookData.availableCopies === 1) await notifyUserIfAvailable(book);

  res.status(200).json({
    status: "success",
    data: {
      issue,
    },
  });
});
