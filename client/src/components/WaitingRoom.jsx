import "../App.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { db, auth } from "../config/firebase.js";
import {
  query,
  collection,
  where,
  updateDoc,
  getDocs,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const socket = io.connect("http://localhost:3000");

function WaitingRoom() {
  const params = useParams();
  const roomCode = params.id;
  const navigate = useNavigate();
  const [userUpdate, setUserUpdate] = useState([]);

  const [playerCount, setPlayerCount] = useState(0);
  const [roomCapacity, setRoomCapacity] = useState(null);

  useEffect(() => {
    socket.emit("join_room", {
      roomCode: roomCode,
      user: auth.currentUser,
    });

    socket.on("room-update", (roomInfo) => {
      setUserUpdate(roomInfo);
    });
  }, [roomCode]);

  console.log(userUpdate);

  return (
    <div className="waitingContainer">
      <h1>Game Room {roomCode} </h1>
      <h2 id="waitingMessage">
        {roomCapacity ? `${playerCount}/${roomCapacity}` : ""}
      </h2>
      <h2>Players</h2>
    </div>
  );
}

export default WaitingRoom;
