import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://buyword-a8012.web.app",
  },
  connectionStateRecovery: {},
});

const port = process.env.PORT || 5000;

const rooms = {};
const isConnected = false;

app.get("/", (req, res) => {
  res.send("WebSocket server is running!");
});

function areObjectsEqual(obj1, obj2) {
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    console.log("type mismatch!");
    return false;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    console.log("length mismatch!");
    return false;
  }

  for (let key of keys1) {
    if (obj1[key] !== obj2[key]) {
      console.log(obj1[key], obj2[key]);
      return false;
    }
  }

  return true;
}

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", ({ roomCode, user }) => {
    console.log("This is the user", user);

    const player = {
      playerID: user.uid,
      playerEmail: user.email,
      playerName: user.displayName,
      socketID: socket.id,
    };

    console.log("room", rooms[roomCode]);

    if (rooms[roomCode]) {
      let isRoom = rooms[roomCode].users.some((existingUser) => {
        return areObjectsEqual(existingUser, player);
      });
      if (!isRoom) {
        rooms[roomCode].users.push(player);
        socket.join(roomCode);
        io.to(roomCode).emit("room-update", rooms[roomCode].users);
        console.log(`User ${user.displayName} joined room: ${roomCode}`);
      }
    } else {
      rooms[roomCode] = { users: [player] };
      console.log("starting room", rooms[roomCode]);
      socket.join(roomCode);
      console.log(`${user.displayName} has started the room: ${roomCode}`);
      io.to(roomCode).emit("room-update", rooms[roomCode].users);
    }
  });

  socket.on("game-update", (playerInfo) => {
    console.log("Passing player information", playerInfo);
    // Need to make sure this is specific to a room later on by using io.to
    io.emit("send-game-update", playerInfo);
  });

  socket.on("disconnecting", () => {
    let roomCode;
    for (const room of socket.rooms) {
      roomCode = room;
    }

    if (rooms[roomCode]) {
      let playerLeftIndex = rooms[roomCode].users.findIndex((existingUser) => {
        return existingUser.socketID === socket.id;
      });

      console.log("player index", playerLeftIndex);

      if (playerLeftIndex != -1) {
        rooms[roomCode].users.splice(playerLeftIndex, 1);
      } else {
        console.log("Player not found");
      }
    }

    if (rooms[roomCode] && rooms[roomCode].users.length > 0) {
      console.log("Did this happen?");
      io.to(roomCode).emit("room-delete", rooms[roomCode].users);
    }

    console.log(`User ${socket.id} left room: ${roomCode}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log("Example app listening on port ${port}!");
});
