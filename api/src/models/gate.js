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
    cameras: {
      entry: {
        name: {
          type: String,
          required: true,
          validate: (value) =>
            validator.isAlpha(value, "cs-CZ", { ignore: " " }),
        },
        isActive: {
          type: Boolean,
          default: true,
        },
        streamUrl: {
          type: String,
          required: true,
          validate: (value) => validator.isURL(value),
        },
        exit: {
          name: {
            type: String,
            required: true,
            validate: (value) =>
              validator.isAlpha(value, "cs-CZ", { ignore: " " }),
          },
          isActive: {
            type: Boolean,
            default: true,
          },
          streamUrl: {
            type: String,
            required: true,
            validate: (value) => validator.isURL(value),
          },
        },
      },
    },
  },
  { versionKey: false }
);

// export order model
export default model("Gate", gateSchema);
