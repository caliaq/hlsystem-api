// imports
import validator from "validator";
import { Schema, model } from "mongoose";

// visitor schema
const visitorSchema = new Schema(
  {
    // firstName: string, required, trimmed, alphabetic
    firstName: {
      type: String,
      required: true,
      trim: true,
      validate: (value) => validator.isAlpha(value, "cs-CZ", { ignore: " " }),
    },
    // lastName: string, required, trimmed, alphabetic
    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: (value) => validator.isAlpha(value, "cs-CZ", { ignore: " " }),
    },
    // email: string, required, trimmed, email
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // Add this to normalize email to lowercase
      validate: (value) => validator.isEmail(value.trim()),
    },
    // phone: string, required, trimmed, mobile phone
    phone: {
      type: String,
      required: true,
      trim: true,
      validate: (value) => validator.isMobilePhone(value.trim()),
    },
  },
  // remove the version key
  { versionKey: false }
);

// export visitor model
export default model("Visitor", visitorSchema);
