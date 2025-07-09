import "dotenv/config";
import validator from "validator";

import Gate from "#models/gate";
import AppError from "#utils/errors";

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
        throw new AppError(
          "gate_controller_error", 
          `Gate controller returned ${response.status}: ${response.statusText}`, 
          502
        );
      }

      const result = await response.json();
      
      if (result.status !== "success") {
        throw new AppError(
          "gate_status_error", 
          result.message || "Failed to get gate status", 
          502
        );
      }

      return {
        isOpen: result.data.is_open,
      };
    } catch (error) {
      // Handle network errors
      if (error.name === 'AbortError') {
        throw new AppError(
          "gate_controller_timeout", 
          "Gate controller request timed out", 
          504
        );
      }
      
      if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
        throw new AppError(
          "gate_controller_unavailable", 
          "Gate controller is not available. Please ensure the gate controller service is running.", 
          503
        );
      }
      
      // Re-throw AppError instances
      if (error instanceof AppError) {
        throw error;
      }
      
      // Handle other errors
      throw new AppError(
        "gate_controller_error", 
        `Failed to communicate with gate controller: ${error.message}`, 
        502
      );
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
        throw new AppError(
          "gate_controller_error", 
          `Gate controller returned ${response.status}: ${response.statusText}`, 
          502
        );
      }

      const result = await response.json();
      
      if (result.status !== "success") {
        throw new AppError(
          "gate_toggle_error", 
          result.message || "Failed to toggle gate", 
          502
        );
      }

      return result.data;
    } catch (error) {
      // Handle network errors
      if (error.name === 'AbortError') {
        throw new AppError(
          "gate_controller_timeout", 
          "Gate controller request timed out", 
          504
        );
      }
      
      if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
        throw new AppError(
          "gate_controller_unavailable", 
          "Gate controller is not available. Please ensure the gate controller service is running.", 
          503
        );
      }
      
      // Re-throw AppError instances
      if (error instanceof AppError) {
        throw error;
      }
      
      // Handle other errors
      throw new AppError(
        "gate_controller_error", 
        `Failed to communicate with gate controller: ${error.message}`, 
        502
      );
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

export default gateService;
