// imports
import Service from "#services/products";

export default {
  getProducts: async (req, res, next) => {
    try {
      // get all products
      const products = await Service.getProducts();

      // send the products (200: OK)
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  addProduct: async (req, res, next) => {
    try {
      // create a new product
      const productId = await Service.createProduct(req.body);

      // send the product id (201: Created)
      res.status(201).json({
        success: true,
        data: { productId },
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  getProduct: async (req, res, next) => {
    try {
      // get the product id from the request parameters
      const { productId } = req.params;

      // get the product by id
      const product = await Service.getProduct(productId);

      // Convert mongoose document to plain object
      const productObj = product.toObject ? product.toObject() : product;

      // send the product (200: OK)
      res.status(200).json({
        success: true,
        data: productObj,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      // get the product id from the request parameters
      const { productId } = req.params;

      // update the product
      const product = await Service.updateProduct(productId, req.body);

      // Convert mongoose document to plain object
      const productObj = product.toObject ? product.toObject() : product;

      // send the updated product (200: OK)
      res.status(200).json({
        success: true,
        data: productObj,
      });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      // get the product id from the request parameters
      const { productId } = req.params;

      // delete the product
      await Service.deleteProduct(productId);

      // send the success response (200: OK)
      res.status(200).json({ success: true });
    } catch (error) {
      // pass the error to the error handler middleware
      next(error);
    }
  },
};
