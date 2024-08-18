import { useState } from "react";
import "../App.css";
import JoinRoomModal from "./modals/JoinRoomModal.jsx";
import StartRoomModal from "./modals/StartRoomModal.jsx";
import NavBar from "./routes/NavBar.jsx";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../config/firebase.js";
import PropTypes from "prop-types";
import {
  query,
  getDocs,
  collection,
  addDoc,
  where,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

function Home({ isAuth, setIsAuth }) {
  const navigate = useNavigate();

  const [isJoinModalOpen, setJoinModalOpen] = useState(false);
  const [isStartModalOpen, setStartModalOpen] = useState(false);

  const [roomID, setRoomID] = useState("");
  const [attemptID, setAttemptID] = useState("");
  const [playerCount, setPlayerCount] = useState(2);
  const [errorMessage, setErrorMessage] = useState("");
  const roomsRef = collection(db, "rooms");

  const generateRoomID = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    return result;
  };

  const checkRoom = async () => {
    let newRoomID = generateRoomID();

    try {
      const data = await getDocs(roomsRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      let inData = filteredData?.some((item) => item.roomId === newRoomID);

      while (inData) {
        newRoomID = generateRoomID();
        inData = filteredData.some((item) => item.name === newRoomID);
      }
    } catch (err) {
      console.error(err);
    }

    setRoomID(newRoomID);
    return newRoomID;
  };

  const makeRoom = async () => {
    const newRoomID = await checkRoom();

    const player = [
      {
        playerID: auth.currentUser.uid,
        playerName: auth.currentUser.displayName,
        playerEmail: auth.currentUser.email,
      },
    ];

    try {
      await addDoc(roomsRef, {
        roomID: newRoomID,
        roomActive: true,
        players: player,
        roomCapacity: playerCount,
        userId: auth?.currentUser?.uid,
      });
    } catch (err) {
      console.log(err);
    }

    return navigate(`lobby/${newRoomID}`);
  };

  const joinRoom = async () => {
    try {
      const q = query(
        collection(db, "rooms"),
        where("roomID", "==", attemptID)
      );
      const data = await getDocs(q);
      const room = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      // Remeber to add some validation so user can't join a room they made or join twice!

      if (room[0]) {
        const roomRef = doc(db, "rooms", room[0].id);
        if (room[0].roomCapacity > room[0].players.length) {
          const newPlayer = {
            playerID: auth.currentUser.uid,
            playerName: auth.currentUser.displayName,
            playerEmail: auth.currentUser.email,
          };
          await updateDoc(roomRef, {
            players: arrayUnion(newPlayer),
          });
          return navigate(`lobby/${attemptID}`);
        } else {
          setErrorMessage("This room is full!");
        }
      } else {
        setErrorMessage("This room number does not exist.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <NavBar isAuth={isAuth} setAuth={setIsAuth} />
      <div className="homeContainer">
        <h1>BuyWord</h1>
        {isJoinModalOpen && (
          <JoinRoomModal
            isAuth={isAuth}
            onClose={() => setJoinModalOpen(false)}
            roomId={attemptID}
            roomChange={setAttemptID}
            handleSubmit={joinRoom}
            errorMessage={errorMessage}
          />
        )}
        {isStartModalOpen && (
          <StartRoomModal
            isAuth={isAuth}
            onClose={() => setStartModalOpen(false)}
            handleSubmit={makeRoom}
            playerInput={playerCount}
            playerOnChange={setPlayerCount}
          />
        )}

        <h3>
          Pay some good hard cash to buy your letters. Then form a word to sell
          at a profit—if you can. Your payoff depends on the quantity, and
          quality, of the letters in the word.
        </h3>
        <div>
          <button
            disabled={!isAuth}
            onClick={() => setStartModalOpen(true)}
            className="start"
          >
            Start A Game
          </button>
          <button disabled={!isAuth} onClick={() => setJoinModalOpen(true)}>
            Join A Game
          </button>
        </div>
      </div>
    </div>
  );
}

Home.propTypes = {
  isAuth: PropTypes.bool.isRequired,
  setIsAuth: PropTypes.func.isRequired,
};

export default Home;
