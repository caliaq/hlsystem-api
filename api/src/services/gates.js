import "dotenv/config";

import Gate from "#models/gate";
import { AppError } from "#utils/errors";
const { GATE_CONTROLLER_URL } = process.env;
import validator from "validator";

const gateService = {
  getGate: async (gateId) => {
    // validate the gate id format
    if (!validator.isMongoId(gateId)) {
      throw new AppError("id", gateId, 400);
    }

    // find the gate by id
    const gate = await Gate.findById(gateId);

    // throw an error if the gate is not found
    if (!gate) {
      throw new AppError("gate", gateId, 404);
    }

    // return the gate
    return gate;
  },
  getGateStatus: async (gateId) => {
    const req = await fetch(`${GATE_CONTROLLER_URL}/gate/${gateId}/status`);

    const { data } = await req.json();

    return {
      isOpen: data.is_open,
    };
  },
  toggleGate: async (gateId) => {
    const response = await fetch(
      `${GATE_CONTROLLER_URL}/gate/${gateId}/toggle`
    );
    const { status, data } = await response.json();

    if (status !== "success") {
      throw new Error("Failed to toggle gate status");
    }
    return data;
  },
  openGate: async (gateId) => {
    const { isOpen } = await gateService.getGateStatus(gateId);

    if (isOpen) {
      console.log(`Gate ${gateId} is already open.`);
      return true; // No need to open again
    } else {
      const { is_open } = await gateService.toggleGate(gateId);
      if (!is_open) {
        throw new Error(`Failed to open gate ${gateId}`);
      }
      console.log(`Gate ${gateId} is now open.`);
    }

    return true;
  },

  closeGate: async (gateId) => {
    const { isOpen } = await gateService.getGateStatus(gateId);

    if (!isOpen) {
      console.log(`Gate ${gateId} is already closed.`);
      return true; // No need to close again
    } else {
      const { is_open } = await gateService.toggleGate(gateId);
      if (is_open) {
        throw new Error(`Failed to close gate ${gateId}`);
      }
      console.log(`Gate ${gateId} is now closed.`);
    }

    return true;
  },
};

export default gateService;
