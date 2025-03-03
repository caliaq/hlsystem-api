// imports
import express from "express";
import VisitorsRouter from "#routes/visitors";
import { errorHandler } from "#middleware/errorHandler";

// app declaration
const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/visitors", VisitorsRouter);

// error handler middleware
app.use(errorHandler);

export default app;
