import "./App.css";
import Home from "./components/Home.jsx";
import RoomRouter from "./components/routes/RoomRouter.jsx";
import NotFound from "./components/routes/NotFound.jsx";
import GameRoom from "./components/GameRoom.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import { auth } from "./config/firebase.js";
import io from "socket.io-client";

const socket = io.connect("https://buyword.onrender.com");
socket.on("connect", () => {
  console.log("Connected to WebSocket server!");
});

function App() {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log({ user });
      setIsAuth(!!user);
    });

    return () => unsubscribe();
  }, []);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              index
              element={<Home isAuth={isAuth} setIsAuth={setIsAuth} />}
            ></Route>
            <Route
              path="/lobby/:id"
              element={<RoomRouter auth={auth} socket={socket} />}
            ></Route>
            <Route
              path="lobby/:id/gameroom"
              element={<GameRoom auth={auth} socket={socket} />}
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
