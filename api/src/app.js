// imports
import express from "express";
import VisitorsRouter from "#routes/visitors";
import OrdersRouter from "#routes/orders";
import ProductsRouter from "#routes/products";
import GatesRouter from "#routes/gates";
import LicensePlatesRouter from "#routes/license-plates";
import LicensePlateImageRouter from "#routes/license-plate-image";
import { errorHandler } from "#middleware/errorHandler";
import swagger from "#utils/swagger";
import cors from "cors";

// app declaration
const app = express();

// middlewares
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);

// routes
app.use("/visitors", VisitorsRouter);
app.use("/orders", OrdersRouter);
app.use("/products", ProductsRouter);
app.use("/gates", GatesRouter);
app.use("/license-plates", LicensePlatesRouter);
app.use("/license-plate", LicensePlateImageRouter);

// Swagger documentation route
app.use("/docs", swagger.serve, swagger.setup);

// error handler middleware
app.use(errorHandler);

export default app;
