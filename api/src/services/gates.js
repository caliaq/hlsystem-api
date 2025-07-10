import "dotenv/config";
import validator from "validator";

import Gate from "#models/gate";
import AppError from "#utils/errors";

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
      `${GATE_CONTROLLER_URL}/gate/${gateId}/toggle`
    );
    const { status, data } = await response.json();
    if (status !== "success") {
      throw new Error("Failed to toggle gate status");
    }
    return data;
  },
};

export default gateService;
