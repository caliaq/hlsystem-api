// imports
import "dotenv/config";
import mongoose from "mongoose";
import app from "#src/app.js";

// env variables
const { MONGODB_URI, API_PORT = 3000 } = process.env;

// server entry point
async function main() {
  try {
    // connect to the database and start the server
    // Temporarily disable MongoDB connection for documentation testing
    await mongoose.connect(MONGODB_URI);
    app.listen(API_PORT);

    console.log(`running on port ${API_PORT}`);
    console.log(
      `Swagger documentation available at http://localhost:${API_PORT}/docs`
    );
  } catch (error) {
    // handle errors
    console.error("couldn't start the server", error);
    process.exit(1);
  }
}

// start the server
main();
