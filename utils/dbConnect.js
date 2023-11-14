import mongoose from "mongoose";
import ensureCounterSequence from "./ensureCounterSequence.js";

const dbConnect = async () => {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@puthipallab.1gtwpll.mongodb.net/?retryWrites=true&w=majority
      `
    )
    .then(async () => {
      await ensureCounterSequence();
      console.log("Successfully connected to MongoDB!");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB", error);
    });
};

export default dbConnect;
