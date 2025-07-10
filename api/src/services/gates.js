import "dotenv/config";
import validator from "validator";

import Gate from "#models/gate";
import { AppError } from "#utils/errors";

const { GATE_CONTROLLER_URL } = process.env;

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
    const url = `${GATE_CONTROLLER_URL}/gate/${gateId}/status`;
    try {
      console.log(
        `[DEBUG] Attempting to connect to gate controller at: ${url}`
      );
      console.log(
        `[DEBUG] GATE_CONTROLLER_URL environment variable: ${GATE_CONTROLLER_URL}`
      );

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      console.log(
        `[DEBUG] Gate controller response status: ${response.status}`
      );

      if (!response.ok) {
        const error = new Error(
          `Gate controller returned ${response.status}: ${response.statusText}`
        );
        error.statusCode = 502;
        error.path = "gate_controller_error";
        error.value = `HTTP ${response.status}`;
        throw error;
      }

      const result = await response.json();
      console.log(`[DEBUG] Gate controller response:`, result);

      if (result.status !== "success") {
        const error = new Error(result.message || "Failed to get gate status");
        error.statusCode = 502;
        error.path = "gate_status_error";
        error.value = result.message || "Failed to get gate status";
        throw error;
      }

      return {
        isOpen: result.data.is_open,
      };
    } catch (error) {
      console.error(
        `[DEBUG] Error communicating with gate controller at ${url}:`,
        error.message
      );

      // Handle network errors
      if (error.name === "AbortError") {
        const timeoutError = new Error("Gate controller request timed out");
        timeoutError.statusCode = 504;
        timeoutError.path = "gate_controller_timeout";
        timeoutError.value = "5 second timeout exceeded";
        throw timeoutError;
      }

      if (
        error.cause?.code === "ECONNREFUSED" ||
        error.message.includes("fetch failed") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ENOTFOUND") ||
        error.code === "ECONNREFUSED" ||
        error.code === "ENOTFOUND"
      ) {
        const connectionError = new Error(
          "Gate controller is not available. Please ensure the gate controller service is running."
        );
        connectionError.statusCode = 503;
        connectionError.path = "gate_controller_unavailable";
        connectionError.value = "Service unavailable";
        throw connectionError;
      }

      // Re-throw existing errors that already have the right structure
      if (error.statusCode && error.path) {
        throw error;
      }

      // Handle other errors
      const genericError = new Error(
        `Failed to communicate with gate controller: ${error.message}`
      );
      genericError.statusCode = 502;
      genericError.path = "gate_controller_error";
      genericError.value = error.message;
      throw genericError;
    }
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
