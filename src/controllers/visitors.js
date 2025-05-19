// imports
import Service from "#services/visitors";

export default {
  addVisitor: async (req, res, next) => {
    try {
      // create a new visitor
      const visitorId = await Service.createVisitor(req.body);

      // send the visitor id (201: Created)
      res.status(201).json({
        success: true,
        data: { visitorId },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  getVisitor: async (req, res, next) => {
    try {
      // get the visitor id from the request parameters
      const { visitorId } = req.params;

      // get the visitor by id
      const visitor = await Service.getVisitor(visitorId);

      // Convert mongoose document to plain object
      const visitorObj = visitor.toObject ? visitor.toObject() : visitor;

      // send the visitor (200: OK)
      res.status(200).json({
        success: true,
        data: visitorObj,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  updateVisitor: async (req, res, next) => {
    try {
      // get the visitor id from the request parameters
      const { visitorId } = req.params;

      // update the visitor
      const visitor = await Service.updateVisitor(visitorId, req.body);

      // Convert mongoose document to plain object
      const visitorObj = visitor.toObject ? visitor.toObject() : visitor;

      // send the updated visitor (200: OK)
      res.status(200).json({
        success: true,
        data: visitorObj,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  deleteVisitor: async (req, res, next) => {
    try {
      // get the visitor id from the request parameters
      const { visitorId } = req.params;

      // delete the visitor
      await Service.deleteVisitor(visitorId);

      // send the success response (200: OK)
      res.status(200).json({ success: true });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
};
