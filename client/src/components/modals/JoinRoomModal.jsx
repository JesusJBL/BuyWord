import Modal from "./Modal.jsx";
import PropTypes from "prop-types";

function JoinRoomModal({
  onClose,
  roomId,
  roomChange,
  handleSubmit,
  errorMessage,
}) {
  return (
    <Modal
      buttonText="Join Room"
      onClose={onClose}
      handleSubmit={handleSubmit}
      buttonColor="#964B00"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          padding: "10px",
          width: "100%",
          alignItems: "center",
        }}
      >
        <label style={{ fontSize: "1.2em", fontWeight: "bold" }}>
          Enter Room Code
        </label>
        <input
          type="text"
          value={roomId}
          onChange={(e) => roomChange(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "300px",
            isRequired: true,
          }}
        />
        <span style={{ color: "darkred" }}>
          {errorMessage ? errorMessage : ""}
        </span>
      </div>
    </Modal>
  );
}

JoinRoomModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  roomId: PropTypes.string.isRequired,
  roomChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default JoinRoomModal;
