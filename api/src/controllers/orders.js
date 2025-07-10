// imports
import Service from "#services/orders";

export default {
  getOrders: async (req, res, next) => {
    try {
      // get all orders
      const orders = await Service.getOrders();

      // send the orders (200: OK)
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  addOrder: async (req, res, next) => {
    try {
      // create a new order
      const orderId = await Service.createOrder(req.body);

      // send the order id (201: Created)
      res.status(201).json({
        success: true,
        data: { orderId },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  getOrder: async (req, res, next) => {
    try {
      // get the order id from the request parameters
      const { orderId } = req.params;

      // get the order by id
      const order = await Service.getOrder(orderId);

      // Convert mongoose document to plain object
      const orderObj = order.toObject ? order.toObject() : order;

      // send the order (200: OK)
      res.status(200).json({
        success: true,
        data: orderObj,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  updateOrder: async (req, res, next) => {
    try {
      // get the order id from the request parameters
      const { orderId } = req.params;

      // update the order
      const order = await Service.updateOrder(orderId, req.body);

      // Convert mongoose document to plain object
      const orderObj = order.toObject ? order.toObject() : order;

      // send the updated order (200: OK)
      res.status(200).json({
        success: true,
        data: orderObj,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  deleteOrder: async (req, res, next) => {
    try {
      // get the order id from the request parameters
      const { orderId } = req.params;

      // delete the order
      await Service.deleteOrder(orderId);

      // send the success response (200: OK)
      res.status(200).json({ success: true });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
};
