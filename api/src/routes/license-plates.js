// imports
import { Router } from "express";
import Controller from "#controllers/license-plates";

// CRUD operational routes for license plates
export default Router()
  .get("/whitelist", Controller.getWhitelist) // read all
  .get("/blacklist", Controller.getBlacklist) // read blacklisted
  .post("/:text", Controller.addLicensePlate); // create with text parameter
