import PropTypes from "prop-types";

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    width: "80%",
    maxWidth: "500px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
  },
  closeButton: {
    alignSelf: "flex-end",
    top: "10px",
    right: "100px",
    background: "#CC393E",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "white",
  },
};

function Modal({ buttonText, buttonColor, children, onClose, handleSubmit }) {
  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button style={styles.closeButton} onClick={onClose}>
          X
        </button>
        <form style={{ width: "100%" }}>{children}</form>
        <button
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            borderRadius: "5px",
            backgroundColor: buttonColor,
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
          onClick={handleSubmit}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

Modal.propTypes = {
  buttonText: PropTypes.string.isRequired,
  buttonColor: PropTypes.string.isRequired,
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
};

export default Modal;
