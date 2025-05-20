// imports
import { Router } from "express";
import Controller from "#controllers/orders";

// CRUD operational routes for order
export default Router()
  .post("/", Controller.addOrder) // create
  .get("/:orderId", Controller.getOrder) // read
  .patch("/:orderId", Controller.updateOrder) // update
  .delete("/:orderId", Controller.deleteOrder); // delete
