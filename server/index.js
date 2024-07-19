import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", ({ roomCode, user }) => {
    if (rooms[roomCode]) {
      rooms[roomCode].users.push(user);
      socket.join(roomCode);
      io.to(roomCode).emit("room-update", rooms[roomCode].users);
      console.log(`User ${user.displayName} joined room: ${roomCode}`);
    } else {
      rooms[roomCode] = { users: [user] };
      socket.join(roomCode);
      console.log(`${socket.id} has joined the room`);
    }
  });

  socket.on("leave_room", (roomCode) => {
    socket.leave(roomCode);
    console.log(`User ${socket.id} left room: ${roomCode}`);
    if (roomUsers[roomCode]) {
      roomUsers[roomCode] -= 1;
    }
    io.to(roomCode).emit("room_users_count", roomUsers[roomCode]);
  });

  socket.on("disconnect", () => {
    socket.disconnect();
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
