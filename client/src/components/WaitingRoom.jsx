import "../App.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../config/firebase.js";
import {
  query,
  collection,
  where,
  updateDoc,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { getAuth } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";

function WaitingRoom({ auth, socket }) {
  const params = useParams();
  const navigate = useNavigate();

  const roomCode = params.id;

  const [currentUser, setCurrentUser] = useState(null);
  const [userUpdate, setUserUpdate] = useState([]);
  const [roomCap, setRoomCap] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "rooms"),
          where("roomID", "==", roomCode)
        );

        const data = await getDocs(q);
        const room = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const roomRef = doc(db, "rooms", room[0].id);
        const roomSnap = await getDoc(roomRef);
        setRoomCap(roomSnap.data().roomCapacity);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [roomCap, roomCode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        console.log("Authenticated user:", user);

        socket.emit("join_room", {
          roomCode: roomCode,
          user: user,
        });

        socket.on("room-update", (roomInfo) => {
          console.log("room information", roomInfo);
          setUserUpdate(roomInfo);
        });
      } else {
        console.log("No user authenticated.");
      }
    });

    console.log(userUpdate);

    return () => unsubscribe();
  }, [auth, roomCode]);

  // Update database based on userUpdate changes
  useEffect(() => {
    if (userUpdate) {
      (async () => {
        try {
          const q = query(
            collection(db, "rooms"),
            where("roomID", "==", roomCode)
          );
          const data = await getDocs(q);
          const room = data.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          const roomRef = doc(db, "rooms", room[0].id);
          await updateDoc(roomRef, {
            players: userUpdate,
          });
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [roomCode, userUpdate]);

  useEffect(() => {
    if ((userUpdate.length != 0) & (userUpdate.length == roomCap)) {
      return navigate(`/lobby/${roomCode}/gameRoom`);
    }
  }, [userUpdate, navigate, roomCap, roomCode]);

  useEffect(() => {
    socket.on("room-delete", (roomInfo) => {
      console.log("Room Info Delete", roomInfo);
      setUserUpdate(roomInfo);
    });
  }, [socket]);

  return (
    <div className="waitingContainer">
      <h1 className="roomCode">Game Room {roomCode}</h1>
      <h2 className="waitingMessage">
        {roomCap ? `${userUpdate.length}/${roomCap}` : ""}
      </h2>
      <h2 className="playersTitle">Players</h2>
      <div className="playersList">
        {userUpdate && userUpdate.length > 0 ? (
          userUpdate.map((user) => (
            <div key={user.playerID} className="playerCard">
              <strong>User:</strong> {user.playerName}
            </div>
          ))
        ) : (
          <p>No players in the room yet.</p>
        )}
      </div>
    </div>
  );
}

WaitingRoom.propTypes = {
  auth: PropTypes.instanceOf(getAuth().constructor).isRequired,
  socket: PropTypes.object.isRequired,
};

export default WaitingRoom;
