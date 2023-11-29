import Book from "../models/bookModel.js";
import Review from "../models/reviewModel.js";
import User from "../models/userModel.js";
import catchAsync from "../utils/catchAsync.js";

export const getOverview = catchAsync(async (req, res, next) => {
  const totalBooks = await Book.countDocuments();
  const totalUsers = await User.countDocuments();
  const totalReviews = await Review.countDocuments();

  const [{ total: issuedBooks }] = await Book.aggregate([
    {
      $project: {
        difference: { $subtract: ["$totalCopies", "$availableCopies"] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$difference" },
      },
    },
  ]);

  const [{ total: totalIssuedBooks }] = await Book.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: "$borrowCount" },
      },
    },
  ]);

  return res.status(200).json({
    status: "success",
    data: {
      totalBooks,
      totalUsers,
      totalReviews,
      totalIssuedBooks,
      issuedBooks,
      returnedBooks: totalIssuedBooks - issuedBooks,
    },
  });
});
