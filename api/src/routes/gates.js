// imports
import { Router } from "express";
import Controller from "#controllers/gates";

export default Router()
  .get("/:gateId", Controller.getGate)
  .get("/:gateId/status", Controller.getGateStatus)
  .get("/:gateId/toggle", Controller.toggleGate)
  .post("/:gateId/opening", Controller.setGateOpening)
  .post("/:gateId/closing", Controller.setGateClosing)
  .post("/:gateId/opened", Controller.setGateOpened)
  .post("/:gateId/closed", Controller.setGateClosed);
