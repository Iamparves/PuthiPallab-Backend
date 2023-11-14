import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const reviewSchema = new mongoose.Schema(
  {
    book: {
      type: ObjectId,
      ref: "Book",
      required: true,
    },
    member: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    ratings: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
