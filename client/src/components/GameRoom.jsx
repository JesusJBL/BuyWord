import "../App.css";
import { useParams } from "react-router-dom";
import { db } from "../config/firebase.js";
import { useState, useEffect } from "react";
import blankTile from "../assets/letters/blankTile.png";
import Die from "./gameItems/Die";
import {
  query,
  collection,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import Player from "./gameItems/Player";
import PropTypes from "prop-types";
import { letters, wildcards } from "../letterData";
import Tile from "./gameItems/Tile";
import PlayerCard from "./gameItems/PlayerCard";
import ax from "axios";

// Styling
const activePlayer = {
  gridArea: "bottom",
  alignItems: "flex-end",
};

const otherPlayer = {
  gridArea: "top",
  alignItems: "flex-start",
};

const possibleTilesStyle = {
  gridArea: "bottom-left",
  alignItems: "center",
};

const otherPossibleTilesStyle = {
  gridArea: "right",
  alignItems: "center",
};

const GameRoom = ({ socket, auth }) => {
  const { id } = useParams();

  const [players, setPlayers] = useState({});
  const [bag, setBag] = useState(letters);
  const [wild, setWild] = useState(wildcards);

  const [die, setDie] = useState(0);
  const [word, setWord] = useState([]);
  const [drawWildTiles, setDrawWildTiles] = useState(false);

  const [isRolling, setIsRolling] = useState(true);
  const [isBuying, setIsBuying] = useState(false);
  const [isSelling, setIsSelling] = useState(false);

  // Helpers
  const currentPlayerKey = Object.keys(players).find(
    (key) => players[key].id === auth.currentUser.uid
  );

  const transformTiles = (tiles) => {
    return tiles.map((tile) => [tile[0], tile[1], blankTile]);
  };

  const canRoll = () => {
    if (players[currentPlayerKey]?.turn && isRolling) {
      return true;
    } else {
      return false;
    }
  };

  const startGame = () => {
    const wildAmount = Math.floor(wild.length / Object.keys(players).length);
    Object.keys(players).forEach((playerID) => {
      drawWild(wildAmount, playerID);
    });

    if (wild.length > 0) {
      setBag([...bag, ...wild]);
      setWild([]);
    }
  };

  const drawTiles = (tileAmount, userKey) => {
    let drawnTiles = [];
    let tileArray = [...bag];

    if (tileAmount <= tileArray.length) {
      for (let i = 0; i < tileAmount; i++) {
        let targetIndex = Math.floor(Math.random() * tileArray.length);
        drawnTiles.push(tileArray[targetIndex]);
        tileArray = tileArray.filter((_, index) => index !== targetIndex);
      }
      setBag(tileArray);
      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [userKey]: {
          ...prevPlayers[userKey],
          possibleTiles: [...prevPlayers[userKey].possibleTiles, ...drawnTiles],
          isBuying: true,
        },
      }));
    } else {
      console.log("There are no tiles left!");
    }
  };

  const onCancelWord = (playerID) => {
    setPlayers((prevPlayers) => {
      const updatedPlayers = {
        ...prevPlayers,
        [playerID]: {
          ...prevPlayers[playerID],
          possibleTiles: [],
          isBuying: false,
          isSelling: true,
        },
      };

      socket.emit("game-update", {
        players: updatedPlayers,
        buyState: isBuying,
        rollingState: isRolling,
      });
      return updatedPlayers;
    });
  };

  const wordValue = (word) => {
    let sum = word.reduce((acc, tile) => acc + tile[1], 0);
    sum = sum ** 2;
    return sum;
  };

  const buyTiles = (playerID) => {
    const possibleWord = players[playerID]?.possibleTiles;
    const wordWorth = wordValue(possibleWord);
    const ans = confirm(`Would you like to buy these tiles for $${wordWorth}?`);

    if (wordWorth > players[playerID].money) {
      alert("You don't have the money to purchase this word!");
      onCancelWord(playerID);
    }

    if (ans) {
      setPlayers((prevPlayers) => {
        const updatedPlayers = {
          ...prevPlayers,
          [playerID]: {
            ...prevPlayers[playerID],
            money: prevPlayers[playerID].money - wordWorth,
            tiles: [
              ...prevPlayers[playerID].tiles,
              ...prevPlayers[playerID].possibleTiles,
            ],
            possibleTiles: [],
            isBuying: false,
            isSelling: true,
          },
        };

        // If this is the last player selling, then we switch states
        if (Object.values(updatedPlayers).every((player) => player.isSelling)) {
          socket.emit("game-update", {
            players: updatedPlayers,
            sellingState: true,
          });
        } else {
          socket.emit("game-update", {
            players: updatedPlayers,
            buyState: isBuying,
            rollingState: isRolling,
          });
        }
        return updatedPlayers;
      });
    }
  };

  const drawWild = (tileAmount, userKey) => {
    let wildArray = [...wild];
    let drawnTiles = [];

    for (let i = 0; i < tileAmount; i++) {
      if (wildArray.length === 0) break;
      let targetIndex = Math.floor(Math.random() * wildArray.length);
      drawnTiles.push(wildArray[targetIndex]);
      wildArray = wildArray.filter((_, index) => index !== targetIndex);
    }

    setWild(wildArray);
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [userKey]: {
        ...prevPlayers[userKey],
        tiles: [...prevPlayers[userKey].tiles, ...drawnTiles],
      },
    }));
  };

  const throwDie = () => {
    let value = Math.floor(Math.random() * 6) + 1;
    if (value === 6) {
      value = parseInt(prompt("Choice! Enter a value between 2-5"), 10);
      while (value < 2 || value > 5) {
        value = parseInt(
          prompt("Invalid value entered! Type a value between 2-5"),
          10
        );
      }
    }
    setDie(value);
  };

  const makeWord = (tile, targetIndex, playerID) => {
    setWord([...word, tile]);
    setPlayers((prevPlayers) => ({
      ...prevPlayers,
      [playerID]: {
        ...prevPlayers[playerID],
        tiles: players[playerID]?.tiles.filter(
          (item, index) => index !== targetIndex
        ),
      },
    }));
  };

  const onClearWord = (playerID) => {
    if (word.length > 0) {
      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [playerID]: {
          ...prevPlayers[playerID],
          tiles: [...prevPlayers[playerID].tiles, ...word],
        },
      }));
      setWord([]);
    }
    console.log({ players });
  };

  const transformWord = () => {
    if (word) return word.map((letter) => `${letter[0]}`).join("");
  };

  const onSubmitWord = async (playerID) => {
    const response = await checkWord();
    if (response.data) {
      const moneyToGain = wordValue(word);

      setPlayers((prevPlayers) => ({
        ...prevPlayers,
        [playerID]: {
          ...prevPlayers[playerID],
          money: players[playerID].money + moneyToGain,
        },
      }));
      setWord([]);
    }
  };

  const onDoneWithWords = (playerID) => {
    // They can't have more than 8 words
    setPlayers((prevPlayers) => {
      const updatedPlayers = {
        ...prevPlayers,
        [playerID]: {
          ...prevPlayers[playerID],
          isSelling: false,
        },
      };

      if (Object.values(updatedPlayers).every((player) => !player.isSelling)) {
        socket.emit("game-update", {
          players: updatedPlayers,
          sellingState: true,
        });
      } else {
        // Add sharing state so that we are done here
        socket.emit("game-update", {
          players: updatedPlayers,
        });
      }
      return updatedPlayers;
    });
  };

  // API call
  const checkWord = async () => {
    if (word.length > 0) {
      let gameWord = transformWord();
      console.log({ gameWord });
      try {
        const response = await ax.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/${gameWord}`
        );
        return response;
      } catch (error) {
        console.error("Error fetching data:", error.message);
        if (error.message === "Request failed with status code 404") {
          onClearWord(auth.currentUser.uid);
        }
      }
    }
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const q = query(collection(db, "rooms"), where("roomID", "==", id));
        const data = await getDocs(q);
        const room = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const roomRef = doc(db, "rooms", room[0].id);
        const roomSnap = await getDoc(roomRef);
        const playersFromDB = roomSnap.data().players;

        const playerInfo = {};
        playersFromDB.forEach((user, i) => {
          playerInfo[user.playerID] = {
            name: user.playerName,
            id: user.playerID,
            tiles: [],
            possibleTiles: [],
            money: 200,
            turn: i == 0 ? true : false,
            socket: user.socketID,
            isBuying: false,
            isSelling: false,
          };
        });

        setPlayers(playerInfo);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRoomData();
  }, [id]);

  // Starting the game
  useEffect(() => {
    if (Object.keys(players).length > 0 && !drawWildTiles) {
      startGame();
      setDrawWildTiles(true);
    }
  }, [players, drawWildTiles]);

  const drawRound = () => {
    Object.keys(players).forEach((playerID) => {
      drawTiles(die, playerID);
    });
  };

  // Going through a round
  useEffect(() => {
    if (die > 0) {
      setIsRolling(false);
      drawRound();
      setIsBuying(true);
    }
    // Selling
  }, [die]);

  useEffect(() => {
    const handleGameUpdate = (updatedPlayers) => {
      console.log("Received update:", updatedPlayers);
      setPlayers(updatedPlayers.players);

      if (updatedPlayers.buyState !== undefined) {
        setIsBuying(updatedPlayers.buyState);
      }

      if (updatedPlayers.rollingState !== undefined) {
        setIsRolling(updatedPlayers.rollingState);
      }

      if (updatedPlayers.sellingState !== undefined) {
        setIsSelling(updatedPlayers.sellingState);
      }
    };

    socket.on("send-game-update", handleGameUpdate);

    return () => {
      socket.off("send-game-update", handleGameUpdate);
    };
  }, [socket]);

  return (
    <div className="gameContainer">
      {players && players[currentPlayerKey] && (
        <Die turn={canRoll()} rollDie={throwDie} die={die} setDie={setDie} />
      )}
      <div className="wordContainer">
        {word.map((key) => (
          <Tile key={key} image={key[2]} />
        ))}
      </div>
      <div className="playersContainer">
        {Object.keys(players).map((key) => (
          <PlayerCard
            key={players[key].socket}
            playerMoney={players[key].money}
            playerName={players[key].name}
            turn={players[key].turn}
          />
        ))}
      </div>
      {players &&
        players[currentPlayerKey] &&
        players[currentPlayerKey].isSelling &&
        isSelling && (
          <div className="buttonContainer">
            <button onClick={() => onClearWord(auth.currentUser.uid)}>
              Cancel Word
            </button>
            <button onClick={() => onSubmitWord(auth.currentUser.uid)}>
              Make Word
            </button>
            <button
              style={{ backgroundColor: "#FEDE00" }}
              onClick={() => onDoneWithWords(auth.currentUser.uid)}
            >
              Done
            </button>
          </div>
        )}

      {players &&
        players[currentPlayerKey] &&
        players[currentPlayerKey].isBuying &&
        isBuying && (
          <div className="buttonContainer">
            <button onClick={() => onCancelWord(auth.currentUser.uid)}>
              Do Not Buy Tiles
            </button>
            <button onClick={() => buyTiles(auth.currentUser.uid)}>
              Buy Tiles
            </button>
          </div>
        )}
      {Object.keys(players).map((key) => (
        <Player
          extraStyles={
            players[key].id === auth.currentUser.uid
              ? activePlayer
              : otherPlayer
          }
          key={players[key].socket}
          tiles={
            players[key].id === auth.currentUser.uid
              ? players[key].tiles
              : transformTiles(players[key].tiles)
          }
          id={currentPlayerKey}
          manageWord={makeWord}
        />
      ))}
      {players && players[currentPlayerKey] && (
        <Player
          key={players[currentPlayerKey].id}
          tiles={players[currentPlayerKey].possibleTiles}
          extraStyles={
            players[currentPlayerKey].id === auth.currentUser.uid
              ? possibleTilesStyle
              : otherPossibleTilesStyle
          }
          id={currentPlayerKey}
        />
      )}
    </div>
  );
};

GameRoom.propTypes = {
  socket: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

export default GameRoom;
