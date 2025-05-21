// imports
import validator from "validator";
import Product from "#models/product";
import { AppError } from "#utils/errors";

export default {
  getProducts: async function () {
    // get all products
    const products = await Product.find();
    // Convert mongoose documents to plain objects
    const productsObj = products.map((product) =>
      product.toObject ? product.toObject() : product
    );
    // return the products
    return productsObj;
  },
  createProduct: async function (data) {
    try {
      // create a new product instance
      const product = new Product(data);

      // validate and save the product instance
      await product.validate();
      await product.save();

      // return the product id
      return product._id;
    } catch (error) {
      // throw the last error
      if (error.errors) {
        const errors = Object.values(error.errors);
        throw errors[errors.length - 1];
      }
      throw error;
    }
  },

  getProduct: async function (productId) {
    // validate the product id format
    if (!validator.isMongoId(productId)) {
      throw new AppError("id", productId, 400);
    }

    // find the product by id
    const product = await Product.findById(productId);

    // throw an error if the product is not found
    if (!product) {
      throw new AppError("product", productId, 404);
    }

    // return the product
    return product;
  },

  updateProduct: async function (productId, patch) {
    try {
      // validate the product id format
      if (!validator.isMongoId(productId)) {
        throw new AppError("id", productId, 400);
      }

      // find and update the product (new: true returns the updated document, runValidators: true runs the validators)
      const product = await Product.findByIdAndUpdate(
        productId,
        { ...patch },
        { new: true, runValidators: true }
      );

      // throw an error if the product is not found
      if (!product) {
        throw new AppError("product", productId, 404);
      }

      // return the updated product
      return product;
    } catch (error) {
      // throw the last error
      if (error.errors) {
        const errors = Object.values(error.errors);
        throw errors[errors.length - 1];
      }
      throw error;
    }
  },

  deleteProduct: async function (productId) {
    // validate the product id format
    if (!validator.isMongoId(productId)) {
      throw new AppError("id", productId, 400);
    }

    // find and delete the product
    const product = await Product.findByIdAndDelete(productId);

    // throw an error if the product is not found
    if (!product) {
      throw new AppError("product", productId, 404);
    }
  },
};
