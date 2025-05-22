// imports
import "dotenv/config";
import mongoose from "mongoose";
import app from "#src/app.js";

// env variables
const { API_PORT = 3000, MONGODB_URI } = process.env;

// server entry point
async function main() {
  try {
    // connect to the database and start the server
    await mongoose.connect(MONGODB_URI);
    app.listen(API_PORT);

    console.log(`running on port ${API_PORT}`);
  } catch (error) {
    // handle errors
    console.error("couldn't start the server", error);
    process.exit(1);
  }
}

// start the server
main();
