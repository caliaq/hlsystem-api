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
      const req = await Service.getGateStatus(gateId);
      const { data } = await req.json();

      // send the status (200: OK)
      res.status(200).json({
        success: true,
        data,
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
