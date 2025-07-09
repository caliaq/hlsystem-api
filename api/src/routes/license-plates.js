// imports
import { Router } from "express";
import Controller from "#controllers/license-plates";

// CRUD operational routes for license plates
export default Router()
  .get("/", Controller.getLicensePlates) // read all
  .post("/:text", Controller.addLicensePlate); // create with text parameter
