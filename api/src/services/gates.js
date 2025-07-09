import "dotenv/config";

import Gate from "#models/gate";
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
    const { data } = await fetch(
      `${GATE_CONTROLLER_URL}/gate/${gateId}/status`
    );
    return {
      isOpen: data.is_open,
    };
  },
  toggleGate: async (gateId) => {
    const { status, data } = await fetch(
      `${GATE_CONTROLLER_URL}/gate/${gateId}/toggle`
    );
    if (status != "success") {
      throw new Error("Failed to toggle gate status");
    }
    return data;
  },
  openGate: async (gateId) => {
    const isOpen = getGateStatus(gateId).data.is_open;

    if (isOpen) {
      console.log(`Gate ${gateId} is already open.`);
      return true; // No need to open again
    } else {
      const { is_open } = await toggleGate(gateId);
      if (!is_open) {
        throw new Error(`Failed to open gate ${gateId}`);
      }
      console.log(`Gate ${gateId} is now open.`);
    }

    return true;
  },

  closeGate: async (gateId) => {
    const isOpen = getGateStatus(gateId).data.is_open;

    if (!isOpen) {
      console.log(`Gate ${gateId} is already closed.`);
      return true; // No need to close again
    } else {
      const { is_open } = await toggleGate(gateId);
      if (is_open) {
        throw new Error(`Failed to close gate ${gateId}`);
      }
      console.log(`Gate ${gateId} is now closed.`);
    }

    return true;
  },
};
