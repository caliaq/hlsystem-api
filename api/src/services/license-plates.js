// imports
import validator from "validator";
import LicensePlate from "#models/license-plate";
import { AppError } from "#utils/errors";

export default {
  getLicensePlates: async function () {
    // get all license plates and populate the order reference
    const licensePlates = await LicensePlate.find().populate("order");

    // Convert mongoose documents to plain objects
    const licensePlatesObj = licensePlates.map((licensePlate) =>
      licensePlate.toObject ? licensePlate.toObject() : licensePlate
    );

    // return the license plates
    return licensePlatesObj;
  },
  createLicensePlate: async function (data) {
    try {
      // validate required fields
      if (!data.text) {
        throw new AppError("License plate text is required", data.text, 400);
      }

      // validate order ID format if provided
      if (data.order && !validator.isMongoId(data.order)) {
        throw new AppError("Invalid order ID format", data.order, 400);
      }

      // create a new license plate instance
      const licensePlate = new LicensePlate(data);

      // validate and save the license plate instance
      await licensePlate.validate();
      await licensePlate.save();

      // return the license plate id
      return licensePlate._id;
    } catch (error) {
      // throw the last error
      if (error.errors) {
        const errors = Object.values(error.errors);
        throw errors[errors.length - 1];
      }
      throw error;
    }
  },
};
