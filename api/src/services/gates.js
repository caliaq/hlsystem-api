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
    try {
      console.log(`Attempting to connect to gate controller at: ${GATE_CONTROLLER_URL}/gate/${gateId}/status`);
      const response = await fetch(
        `${GATE_CONTROLLER_URL}/gate/${gateId}/status`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Add timeout to prevent hanging
          signal: AbortSignal.timeout(5000), // 5 second timeout
        }
      );

      if (!response.ok) {
        const error = new Error(`Gate controller returned ${response.status}: ${response.statusText}`);
        error.statusCode = 502;
        error.path = "gate_controller_error";
        error.value = `HTTP ${response.status}`;
        throw error;
      }

      const result = await response.json();
      
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
      // Handle network errors
      if (error.name === 'AbortError') {
        const timeoutError = new Error("Gate controller request timed out");
        timeoutError.statusCode = 504;
        timeoutError.path = "gate_controller_timeout";
        timeoutError.value = "5 second timeout exceeded";
        throw timeoutError;
      }
      
      if (error.cause?.code === 'ECONNREFUSED' || 
          error.message.includes('fetch failed') || 
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ENOTFOUND') ||
          error.code === 'ECONNREFUSED' ||
          error.code === 'ENOTFOUND') {
        const connectionError = new Error("Gate controller is not available. Please ensure the gate controller service is running.");
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
      const genericError = new Error(`Failed to communicate with gate controller: ${error.message}`);
      genericError.statusCode = 502;
      genericError.path = "gate_controller_error";
      genericError.value = error.message;
      throw genericError;
    }
  },
  toggleGate: async (gateId) => {
    try {
      const response = await fetch(
        `${GATE_CONTROLLER_URL}/gate/${gateId}/toggle`,
        { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        }
      );

      if (!response.ok) {
        const error = new Error(`Gate controller returned ${response.status}: ${response.statusText}`);
        error.statusCode = 502;
        error.path = "gate_controller_error";
        error.value = `HTTP ${response.status}`;
        throw error;
      }

      const result = await response.json();
      
      if (result.status !== "success") {
        const error = new Error(result.message || "Failed to toggle gate");
        error.statusCode = 502;
        error.path = "gate_toggle_error";
        error.value = result.message || "Failed to toggle gate";
        throw error;
      }

      return result.data;
    } catch (error) {
      // Handle network errors
      if (error.name === 'AbortError') {
        const timeoutError = new Error("Gate controller request timed out");
        timeoutError.statusCode = 504;
        timeoutError.path = "gate_controller_timeout";
        timeoutError.value = "5 second timeout exceeded";
        throw timeoutError;
      }
      
      if (error.cause?.code === 'ECONNREFUSED' || 
          error.message.includes('fetch failed') || 
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ENOTFOUND') ||
          error.code === 'ECONNREFUSED' ||
          error.code === 'ENOTFOUND') {
        const connectionError = new Error("Gate controller is not available. Please ensure the gate controller service is running.");
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
      const genericError = new Error(`Failed to communicate with gate controller: ${error.message}`);
      genericError.statusCode = 502;
      genericError.path = "gate_controller_error";
      genericError.value = error.message;
      throw genericError;
    }
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
        const error = new Error(`Failed to open gate ${gateId}`);
        error.statusCode = 500;
        error.path = "gate_open_failed";
        error.value = gateId;
        throw error;
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
        const error = new Error(`Failed to close gate ${gateId}`);
        error.statusCode = 500;
        error.path = "gate_close_failed";
        error.value = gateId;
        throw error;
      }
      console.log(`Gate ${gateId} is now closed.`);
    }

    return true;
  },
};

export default gateService;
