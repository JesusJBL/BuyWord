import WaitingRoom from "../WaitingRoom.jsx";
import PropTypes from "prop-types";
import { getAuth } from 'firebase/auth';

const RoomRouter = ({ auth, socket }) => {
  return <WaitingRoom auth={auth} socket={socket} />;
};

RoomRouter.propTypes = {
    auth: PropTypes.instanceOf(getAuth().constructor).isRequired,
    socket: PropTypes.object.isRequired
}

export default RoomRouter;
