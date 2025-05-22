// imports
import mongoose, { Schema, model } from "mongoose";
import validator from "validator";

// order schema
const orderSchema = new Schema(
  {
    // visitorId: mongoId, required
    visitorId: {
      type: Schema.Types.ObjectId,
      ref: "Visitor",
      validate: async (value) =>
        !!(await mongoose.model("Visitor").findById(value)),
    },
    // products array with productId and quantity
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
          validate: async (value) =>
            !!(await mongoose.model("Product").findById(value)),
        },
        quantity: {
          type: Number,
          required: true,
          validate: (value) =>
            validator.isNumeric(value.toString()) && value <= 99,
        },
        duration: {
          type: Number,
          validate: (value) => validator.isNumeric(value.toString()),
        },
      },
    ],
    // startDate: date, required
    date: {
      type: Date,
      required: true,
      validate: (value) => !isNaN(new Date(value).getTime()),
    },
  },
  // remove the version key
  { versionKey: false }
);

// export order model
export default model("Order", orderSchema);
