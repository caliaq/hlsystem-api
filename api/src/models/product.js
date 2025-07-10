// imports
import validator from "validator";
import { Schema, model } from "mongoose";

// product schema
const productSchema = new Schema(
  {
    // name: string, required, trimmed, alphabetic, max: 100
    name: {
      type: String,
      required: true,
      trim: true,
      validate: (value) => validator.isLength(value, { min: 0, max: 100 }),
    },
    // price: number, required, numeric
    price: {
      type: Number,
      required: true,
      validate: (value) => validator.isNumeric(value.toString()),
    },
    // description: string, trimmed, max: 500
    description: {
      type: String,
      trim: true,
      validate: (value) => validator.isLength(value, { min: 0, max: 500 }),
    },
  },
  // remove the version key
  { versionKey: false }
);

// export product model
export default model("Product", productSchema);
