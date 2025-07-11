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
      await Service.toggleGate(gateId);

      // send a success response (200: OK)
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
};
