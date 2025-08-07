// imports
import Service from "#services/license-plates";

export default {
  getLicensePlates: async (req, res, next) => {
    try {
      // get all license plates
      const licensePlates = await Service.getLicensePlates();

      // send the license plates (200: OK)
      res.status(200).json({
        success: true,
        data: licensePlates,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  addLicensePlate: async (req, res, next) => {
    try {
      // get the license plate text from the request parameters
      const { text } = req.params;

      // create a new license plate with the text and request body data
      const licensePlateId = await Service.createLicensePlate({
        text,
        ...req.body,
      });

      // send the license plate id (201: Created)
      res.status(201).json({
        success: true,
        data: { licensePlateId },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  deleteLicensePlate: async (req, res, next) => {
    try {
      // get the license plate id from the request parameters
      const { id } = req.params;

      // delete the license plate with the given id
      await Service.deleteLicensePlate(id);

      // send success response (204: No Content)
      res.status(204).json({
        success: true,
        data: null,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
};
