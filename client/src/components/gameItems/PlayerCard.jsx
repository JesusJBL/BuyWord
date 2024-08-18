import PropTypes from "prop-types";

const PlayerCard = ({ playerName, playerMoney, turn }) => {
  const cardStyle = {
    border: turn ? "5px solid gold" : "1px solid #ccc",
    borderRadius: "8px",
    padding: "16px",
    margin: "10px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    maxWidth: "200px",
    fontFamily: "Arial, sans-serif",
  };

  const nameStyle = {
    fontSize: "1.2em",
    fontWeight: "bold",
  };

  const moneyStyle = {
    color: "#4CAF50",
    fontSize: "1.1em",
  };

  return (
    <div style={cardStyle}>
      <div style={nameStyle}>{playerName}</div>
      <div style={moneyStyle}>${playerMoney}</div>
    </div>
  );
};

PlayerCard.propTypes = {
  playerName: PropTypes.string.isRequired,
  playerMoney: PropTypes.number.isRequired,
  turn: PropTypes.bool.isRequired,
};

export default PlayerCard;
