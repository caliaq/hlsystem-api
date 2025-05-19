// imports
import { Router } from "express";
import Controller from "#controllers/visitors";

// CRUD operational routes for visitor
export default Router()
  .post("/", Controller.addVisitor) // create
  .get("/:visitorId", Controller.getVisitor) // read
  .patch("/:visitorId", Controller.updateVisitor) // update
  .delete("/:visitorId", Controller.deleteVisitor); // delete
