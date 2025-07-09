// imports
import { Router } from "express";
import Controller from "#controllers/license-plate-image";

// License plate image upload and serving routes
export default Router()
  .post("/", Controller.uploadLicensePlate) // upload image
  .get("/", Controller.getLicensePlateImage); // serve image
