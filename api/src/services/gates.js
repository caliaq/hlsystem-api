import "dotenv/config";
import validator from "validator";

import Gate from "#models/gate";
import AppError from "#utils/errors";

const { GATE_CONTROLLER_URL } = process.env;

export default {
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
    const response = await fetch(
      `${GATE_CONTROLLER_URL}/gate/${gateId}/status`
    );
    const result = await response.json();
    return {
      isOpen: result.data.is_open,
    };
  },
  toggleGate: async (gateId) => {
    const response = await fetch(
      `${GATE_CONTROLLER_URL}/gate/${gateId}/toggle`,
      { method: 'POST' }
    );
    const result = await response.json();
    if (result.status !== "success") {
      throw new Error("Failed to toggle gate status");
    }
    return result.data;
  },
  openGate: async (gateId) => {
    const currentStatus = await this.getGateStatus(gateId);
    const isOpen = currentStatus.isOpen;

    if (isOpen) {
      console.log(`Gate ${gateId} is already open.`);
      return true; // No need to open again
    } else {
      const { is_open } = await this.toggleGate(gateId);
      if (!is_open) {
        throw new Error(`Failed to open gate ${gateId}`);
      }
      console.log(`Gate ${gateId} is now open.`);
    }

    return true;
  },

  closeGate: async (gateId) => {
    const currentStatus = await this.getGateStatus(gateId);
    const isOpen = currentStatus.isOpen;

    if (!isOpen) {
      console.log(`Gate ${gateId} is already closed.`);
      return true; // No need to close again
    } else {
      const { is_open } = await this.toggleGate(gateId);
      if (is_open) {
        throw new Error(`Failed to close gate ${gateId}`);
      }
      console.log(`Gate ${gateId} is now closed.`);
    }

    return true;
  },
};
