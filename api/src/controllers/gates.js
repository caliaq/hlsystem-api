import Service from "../services/gates.js";

export default {
  getGate: async (req, res, next) => {
    try {
      const { gateId } = req.params;
      // get gate
      const gate = await Service.getGate(gateId);

      // send the gate (200: OK)
      res.status(200).json({
        success: true,
        data: {
          ...gate.toObject(),
          status: await Service.getGateStatus(gateId),
          cameras: {
            entry: await Service.getGateCamera(gateId, "entry"),
            exit: await Service.getGateCamera(gateId, "exit"),
          },
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
      const status = await Service.getGateStatus(gateId);

      // send the status (200: OK)
      res.status(200).json({
        success: true,
        data: status,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  openGate: async (req, res, next) => {
    try {
      const { gateId } = req.params;
      await Service.openGate(gateId);

      // send a success response (200: OK)
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  closeGate: async (req, res, next) => {
    try {
      const { gateId } = req.params;
      await Service.closeGate(gateId);

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
