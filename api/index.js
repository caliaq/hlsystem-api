// imports
import "dotenv/config";
import mongoose from "mongoose";
import { createServer } from "http";
import { Server } from "socket.io";
import app from "#src/app.js";

// env variables
const { MONGODB_URI, API_PORT = 3000 } = process.env;

// server entry point
async function main() {
  try {
    // create HTTP server
    const server = createServer(app);
    
    // setup Socket.IO
    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    // make io available to the app
    app.set('socketio', io);

    // WebSocket connection handling
    io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);

      // Handle client disconnect
      socket.on('disconnect', () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
    });

    // connect to the database and start the server
    // Temporarily disable MongoDB connection for documentation testing
    await mongoose.connect(MONGODB_URI);
    server.listen(API_PORT);

    console.log(`running on port ${API_PORT}`);
    console.log(
      `Swagger documentation available at http://localhost:${API_PORT}/docs`
    );
    console.log('WebSocket server is ready for connections');
  } catch (error) {
    // handle errors
    console.error("couldn't start the server", error);
    process.exit(1);
  }
}

// start the server
main();
