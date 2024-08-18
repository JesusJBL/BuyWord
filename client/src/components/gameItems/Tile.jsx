import React from "react";
import PropTypes from "prop-types";

const Tile = ({ image, onClick }) => {
  const tileStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "75px",
    height: "75px",
    border: "2px solid #ccc",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    backgroundColor: "#fff",
    transition: "transform 0.2s, box-shadow 0.2s",
    position: "relative",
    overflow: "hidden",
    zIndex: "1",
  };

  const imageStyle = {
    maxWidth: "80%",
    maxHeight: "80%",
  };

  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      style={{
        ...tileStyle,
        transform: hovered ? "scale(1.05)" : "scale(1)",
        boxShadow: hovered
          ? "0 6px 12px rgba(0, 0, 0, 0.3)"
          : "0 4px 8px rgba(0, 0, 0, 0.2)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <img style={imageStyle} src={image} alt="Tile" />
    </div>
  );
};

Tile.propTypes = {
  image: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default Tile;
