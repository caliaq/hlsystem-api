// imports
import validator from "validator";
import { Schema, model } from "mongoose";

// order schema
const orderSchema = new Schema(
  {
    // visitorId: mongoId, required
    visitorId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Visitor",
    },
    // productId: mongoId, required
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    // startDate: date, required
    startDate: {
      type: Date,
      required: true,
      validate: (value) => validator.isDate(value.toString()),
    },
    // duration: number, required, numeric (in milliseconds)
    duration: {
      type: Number,
      required: true,
      validate: (value) => validator.isNumeric(value.toString()),
    },
    // quantity: number, required, numeric, max: 99
    quantity: {
      type: Number,
      required: true,
      validate: (value) => validator.isNumeric(value.toString()) && value <= 99,
    },
  },
  // remove the version key
  { versionKey: false }
);

// export order model
export default model("Order", orderSchema);
