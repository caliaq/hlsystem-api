// imports
import express from "express";
import VisitorsRouter from "#routes/visitors";
import OrdersRouter from "#routes/orders";
import ProductsRouter from "#routes/products";
import { errorHandler } from "#middleware/errorHandler";
import swagger from "#utils/swagger";

// app declaration
const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/visitors", VisitorsRouter);
app.use("/orders", OrdersRouter);
app.use("/products", ProductsRouter);

// Swagger documentation route
app.use("/docs", swagger.serve, swagger.setup);

// error handler middleware
app.use(errorHandler);

export default app;
