// imports
import { Schema, model } from "mongoose";
import validator from "validator";

// license plate schema
const licensePlate = new Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      validate: (value) => validator.isLicensePlate(value, "any"),
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: false,
      validate: async (value) => {
        // Only validate if value is provided
        if (value) {
          return !!(await model("Order").findById(value));
        }
        return true;
      },
    },
  },
  { versionKey: false }
);

// export license plate model
export default model("LicensePlate", licensePlate);
