import Modal from "./Modal.jsx";
import PropTypes from "prop-types";

function StartRoomModal({
  onClose,
  handleSubmit,
  playerInput,
  playerOnChange,
}) {
  return (
    <Modal
      buttonText="Create Room"
      onClose={onClose}
      handleSubmit={handleSubmit}
      buttonColor="#023020"
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
          Select Number of Players
        </label>
        <input
          type="number"
          value={playerInput}
          onChange={(e) => playerOnChange(Number(e.target.value))}
          max="2"
          min="2"
          style={{
            padding: "10px",
            borderRadius: "5px",
            border: "1px solid #ccc",
            width: "100%",
            maxWidth: "300px",
          }}
        />
      </div>
    </Modal>
  );
}

StartRoomModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  playerInput: PropTypes.number.isRequired,
  playerOnChange: PropTypes.func.isRequired,
  errorMessage: PropTypes.func.isRequired,
};

export default StartRoomModal;
