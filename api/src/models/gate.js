// imports
import { Schema, model } from "mongoose";
import validator from "validator";

// order schema
const gateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      validate: (value) => validator.isAlpha(value, "cs-CZ", { ignore: " " }),
    },
  },
  // remove the version key
  { versionKey: false }
);

// export order model
export default model("Gate", gateSchema);
