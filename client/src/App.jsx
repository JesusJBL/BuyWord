import "./App.css";
import Home from "./components/Home.jsx";
import RoomRouter from "./components/routes/RoomRouter.jsx";
import NotFound from "./components/routes/NotFound.jsx";
import GameRoom from "./components/GameRoom.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<Home />}></Route>
            <Route index={false} path="/lobby/:id" element={<RoomRouter />}>
              <Route index element={<GameRoom />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
