import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

const waitlistSchema = new mongoose.Schema(
  {
    book: {
      type: ObjectId,
      ref: "Book",
      required: [true, "A waitlist must belong to a book"],
    },
    waitingList: [
      {
        type: ObjectId,
        ref: "User",
        required: [true, "A waitlist must have a user"],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Waitlist = mongoose.model("Waitlist", waitlistSchema);

export default Waitlist;
