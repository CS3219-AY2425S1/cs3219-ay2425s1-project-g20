import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import CodeModel from "./Code";

// MongoDB connection
const mongoUri = "mongodb://localhost:27017/collaboration";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Allow all origins (adjust as needed)
    methods: ["GET", "POST"], // Allowed methods
  },
});

io.on("connection", (socket) => {
  socket.on("join-collab", (collabId, userId) => {
    // Join the room
    socket.join(collabId);

    socket.on("code-get", () => {
      // Fetch the document content
      CodeModel.findById(collabId, (err, data) => {
        if (err) {
          console.error("Failed to find document", err);
          return;
        }
        // Emit the code to the client
        socket.emit("code-get", data.content);
      });
    });

    // Listen for code changes
    socket.on("code-change", (code) => {
      // Update the document
      CodeModel.findByIdAndUpdate(collabId, { content: code }, (err) => {
        if (err) {
          console.error("Failed to update document", err);
          return;
        }
        // Broadcast the code change to all clients
        socket.emit("code-get", code);
      });
    });

    // Broadcast user connections and disconnections
    socket.emit("user-connected", userId);
    socket.on("disconnect", () => {
      socket.emit("user-disconnected", userId);
    });
  });
});

httpServer.listen(3000);
