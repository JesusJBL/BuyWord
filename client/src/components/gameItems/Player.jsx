import Tile from "./Tile";
import PropTypes from "prop-types";
import "../../App.css";

const Player = ({ tiles, extraStyles, manageWord, id, turn }) => {
  const tileContainer = {
    display: "flex",
    margin: 0,
    padding: 20,
    ...extraStyles,
    justifyContent: "center",
  };

  const handleClick = (tile, index) => {
    console.log("Hey");
    if (manageWord) {
      manageWord(tile, index, id);
    } else {
      console.warn("Can't select right now!");
    }
  };

  return (
    <div style={tileContainer}>
      {tiles &&
        tiles.map((tile, index) => (
          <Tile
            key={index}
            image={tile[2]}
            onClick={() => handleClick(tile, index)}
          />
        ))}
    </div>
  );
};

Player.propTypes = {
  tiles: PropTypes.array.isRequired,
  extraStyles: PropTypes.object.isRequired,
  manageWord: PropTypes.func,
  id: PropTypes.string.isRequired,
  turn: PropTypes.bool,
};

export default Player;
