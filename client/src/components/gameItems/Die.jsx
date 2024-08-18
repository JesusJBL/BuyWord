import { useEffect } from "react";
import { motion } from "framer-motion";
import "../../Die.css";
import PropTypes from "prop-types";
import "../../App.css";

const Die = ({ rollDie, die, turn }) => {
  // ANIMATIONS
  const container = {
    hidden: { opacity: 1, scale: 0 },
    visible: {
      scale: [0, 1],
      opacity: 1,
      transition: {
        staggerChildren: 0.5,
        delayChildren: 0.5,
      },
    },
  };

  const discsOnTheDie = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: [0.2, 1],
    },
  };

  const discNumbers = new Array(die);

  // Assigning 0 to randomSize to the array
  for (var i = 0; i < discNumbers.length; i++) {
    discNumbers[i] = i;
  }

  useEffect(() => {}, [die]);

  return (
    <div className="die-container">
      <motion.ul
        className="square-container"
        variants={container}
        initial="hidden"
        animate="visible"
      >
        {discNumbers.map((index) => (
          <motion.li key={index} className="disc" variants={discsOnTheDie} />
        ))}
      </motion.ul>
      <button
        disabled={!turn}
        onClick={() => {
          rollDie();
        }}
      >
        {" "}
        ROLL{" "}
      </button>
    </div>
  );
};

Die.propTypes = {
  die: PropTypes.number.isRequired,
  rollDie: PropTypes.func.isRequired,
  turn: PropTypes.bool.isRequired,
};

export default Die;
