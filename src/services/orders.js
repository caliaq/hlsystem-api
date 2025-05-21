// imports
import validator from "validator";
import Order from "#models/order";
import Visitor from "#models/visitor";
import Product from "#models/product";
import { AppError } from "#utils/errors";

export default {
  createOrder: async function (data) {
    try {
      // Create a new order instance
      const order = new Order(data);

      // Validate and save the order instance
      await order.validate();
      await order.save();

      // Return the order id
      return order._id;
    } catch (error) {
      // Handle validation errors
      if (error.errors) {
        const errors = Object.values(error.errors);
        throw errors[errors.length - 1];
      }
      throw error;
    }
  },

  getOrder: async function (orderId) {
    // validate the order id format
    if (!validator.isMongoId(orderId)) {
      throw new AppError("id", orderId, 400);
    }

    // find the order by id
    const order = await Order.findById(orderId);

    // throw an error if the order is not found
    if (!order) {
      throw new AppError("order", orderId, 404);
    }

    // return the order
    return order;
  },

  updateOrder: async function (orderId, patch) {
    try {
      // validate the order id format
      if (!validator.isMongoId(orderId)) {
        throw new AppError("id", orderId, 400);
      }

      // find and update the order (new: true returns the updated document, runValidators: true runs the validators)
      const order = await Order.findByIdAndUpdate(
        orderId,
        { ...patch },
        { new: true, runValidators: true }
      );

      // throw an error if the order is not found
      if (!order) {
        throw new AppError("order", orderId, 404);
      }

      // return the updated order
      return order;
    } catch (error) {
      // throw the last error
      if (error.errors) {
        const errors = Object.values(error.errors);
        throw errors[errors.length - 1];
      }
      throw error;
    }
  },

  deleteOrder: async function (orderId) {
    // validate the order id format
    if (!validator.isMongoId(orderId)) {
      throw new AppError("id", orderId, 400);
    }

    // find and delete the order
    const order = await Order.findByIdAndDelete(orderId);

    // throw an error if the order is not found
    if (!order) {
      throw new AppError("order", orderId, 404);
    }
  },
};
