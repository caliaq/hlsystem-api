import Service from "../services/gates.js";

export default {
  getGate: async (req, res, next) => {
    try {
      const { gateId } = req.params;
      // get gate
      const gate = await Service.getGate(gateId);
      const { isOpen } = await Service.getGateStatus(gateId);
      // send the gate (200: OK)
      res.status(200).json({
        success: true,
        data: {
          ...gate.toObject(),
          isOpen,
        },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  getGateStatus: async (req, res, next) => {
    try {
      const { gateId } = req.params;
      // get gate status
      const gateStatus = await Service.getGateStatus(gateId);

      // send the status (200: OK)
      res.status(200).json({
        success: true,
        data: gateStatus,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  toggleGate: async (req, res, next) => {
    try {
      const { gateId } = req.params;

      // Toggle the gate
      await Service.toggleGate(gateId);

      const currentStatus = await Service.getGateStatus(gateId);
      const newStatus = currentStatus.isOpen;

      // send a success response (200: OK) - NO WebSocket emission
      res.status(200).json({
        success: true,
        data: {
          gateId,
          isOpen: newStatus,
          message: `Gate ${newStatus ? "opened" : "closed"} successfully`,
        },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },

  // Endpoint to send gate opening message
  setGateOpening: async (req, res, next) => {
    try {
      const { gateId } = req.params;

      // Get WebSocket service and emit gate opening message
      const websocketService = req.app.get("websocketService");
      if (websocketService) {
        websocketService.emitGateOpening(gateId);
      }

      // send a success response (200: OK)
      res.status(200).json({
        success: true,
        data: {
          gateId,
          message: `Gate opening message sent for gate ${gateId}`,
        },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },

  // Endpoint to send gate closing message
  setGateClosing: async (req, res, next) => {
    try {
      const { gateId } = req.params;

      // Get WebSocket service and emit gate closing message
      const websocketService = req.app.get("websocketService");
      if (websocketService) {
        websocketService.emitGateClosing(gateId);
      }

      // send a success response (200: OK)
      res.status(200).json({
        success: true,
        data: {
          gateId,
          message: `Gate closing message sent for gate ${gateId}`,
        },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },

  // Endpoint to send gate opened message
  setGateOpened: async (req, res, next) => {
    try {
      const { gateId } = req.params;

      // Get WebSocket service and emit gate opened message
      const websocketService = req.app.get("websocketService");
      if (websocketService) {
        websocketService.emitGateOpened(gateId);
      }

      // send a success response (200: OK)
      res.status(200).json({
        success: true,
        data: {
          gateId,
          message: `Gate opened message sent for gate ${gateId}`,
        },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },

  // Endpoint to send gate closed message
  setGateClosed: async (req, res, next) => {
    try {
      const { gateId } = req.params;

      // Get WebSocket service and emit gate closed message
      const websocketService = req.app.get("websocketService");
      if (websocketService) {
        websocketService.emitGateClosed(gateId);
      }

      // send a success response (200: OK)
      res.status(200).json({
        success: true,
        data: {
          gateId,
          message: `Gate closed message sent for gate ${gateId}`,
        },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
};
