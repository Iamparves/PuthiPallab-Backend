import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config.js";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import xss from "xss-clean";

import globalErrorHander from "./controllers/errorController.js";
import bookRouter from "./routes/bookRoutes.js";
import genreRouter from "./routes/genreRoutes.js";
import issueRouter from "./routes/issueRoutes.js";
import reviewRouter from "./routes/reviewRoutes.js";
import userRouter from "./routes/userRoutes.js";
import waitlistRouter from "./routes/waitlistRoutes.js";
import AppError from "./utils/appError.js";
import dbConnect from "./utils/dbConnect.js";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err);

  process.exit(1);
});

dbConnect();

const app = express();

app.disable("x-powered-by");

// Security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser, cors, cookie parser
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: ["language", "categories"],
  })
);

// API Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/genres", genreRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/issues", issueRouter);
app.use("/api/v1/waitlist", waitlistRouter);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Welcome to the Puthi Pallab API",
  });
});

// 404 route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHander);

const port = 3000;
const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});
