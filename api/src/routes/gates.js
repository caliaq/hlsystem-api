// imports
import { Router } from "express";
import Controller from "#controllers/gates";

export default Router()
  .get("/:gateId:", Controller.getGate)
  .get("/:gateId:/status", Controller.getGateStatus)
  .get("/:gateId:/open", Controller.openGate)
  .get("/:gateId:/close", Controller.closeGate);
