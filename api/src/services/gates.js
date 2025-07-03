import Gate from "#models/gate";

const data = {
  isOpen: false,
};

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
    return {
      isOpen: data.isOpen,
      isMoving: false,
      lastUpdated: new Date().toISOString(),
    };
  },
  getGateCamera: async (gateId, type) => {
    return {
      name: "Camera 1",
      isActive: true,
      streamUrl: `http://camera-${type}.example.com/stream`,
    };
  },
  openGate: async (gateId) => {
    data.isOpen = true; // Simulating gate status based on data object
    console.log(
      `Gate ${gateId} status updated: ${data.isOpen ? "Open" : "Closed"}`
    );
    // Logic to open the gate
    return true;
  },

  closeGate: async (gateId) => {
    data.isOpen = false; // Simulating gate status based on data object
    console.log(
      `Gate ${gateId} status updated: ${data.isOpen ? "Open" : "Closed"}`
    );
    // Logic to close the gate
    return true;
  },
};
