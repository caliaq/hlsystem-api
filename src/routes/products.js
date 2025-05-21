// imports
import { Router } from "express";
import Controller from "#controllers/products";

// CRUD operational routes for product
export default Router()
  .get("/", Controller.getProducts) // read all
  .post("/", Controller.addProduct) // create
  .get("/:productId", Controller.getProduct) // read
  .patch("/:productId", Controller.updateProduct) // update
  .delete("/:productId", Controller.deleteProduct); // delete
