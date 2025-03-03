// imports
import validator from "validator";
import Visitor from "#models/visitor";
import { AppError } from "#utils/errors";

export default {
  createVisitor: async function (data) {
    try {
      // create a new visitor instance
      const visitor = new Visitor(data);

      // validate and save the visitor instance
      await visitor.validate();
      await visitor.save();

      // return the visitor id
      return visitor._id;
    } catch (error) {
      // throw the last error
      if (error.errors) {
        const errors = Object.values(error.errors);
        throw errors[errors.length - 1];
      }
      throw error;
    }
  },

  getVisitor: async function (visitorId) {
    // validate the visitor id format
    if (!validator.isMongoId(visitorId)) {
      throw new AppError("id", visitorId, 400);
    }

    // find the visitor by id
    const visitor = await Visitor.findById(visitorId);

    // throw an error if the visitor is not found
    if (!visitor) {
      throw new AppError("visitor", visitorId, 404);
    }

    // return the visitor
    return visitor;
  },

  updateVisitor: async function (visitorId, patch) {
    try {
      // validate the visitor id format
      if (!validator.isMongoId(visitorId)) {
        throw new AppError("id", visitorId, 400);
      }

      // find and update the visitor (new: true returns the updated document, runValidators: true runs the validators)
      const visitor = await Visitor.findByIdAndUpdate(
        visitorId,
        { ...patch },
        { new: true, runValidators: true }
      );

      // throw an error if the visitor is not found
      if (!visitor) {
        throw new AppError("visitor", visitorId, 404);
      }

      // return the updated visitor
      return visitor;
    } catch (error) {
      // throw the last error
      if (error.errors) {
        const errors = Object.values(error.errors);
        throw errors[errors.length - 1];
      }
      throw error;
    }
  },

  deleteVisitor: async function (visitorId) {
    // validate the visitor id format
    if (!validator.isMongoId(visitorId)) {
      throw new AppError("id", visitorId, 400);
    }

    // find and delete the visitor
    const visitor = await Visitor.findByIdAndDelete(visitorId);

    // throw an error if the visitor is not found
    if (!visitor) {
      throw new AppError("visitor", visitorId, 404);
    }
  },
};
