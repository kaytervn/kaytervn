import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";

const GameOverlay = ({
  timer,
  playerHealth,
  enemyHealth,
  gameText,
  end,
  onReset,
}: any) => {
  return (
    <div>
      <div className="absolute inset-0 z-10 pointer-events-none top-10 max-w-6xl mx-auto">
        <motion.div
          className="flex items-center justify-between h-20"
          style={{ fontFamily: '"Press Start 2P", system-ui' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div
            className="relative flex-1 flex justify-end"
            style={{
              borderTop: "5px solid white",
              borderBottom: "5px solid white",
              borderLeft: "5px solid white",
            }}
          >
            <div className="bg-red-500 h-10 w-full" />
            <motion.div
              className="bg-[#818cf8] absolute top-0 bottom-0 right-0"
              initial={{ width: "100%" }}
              animate={{ width: `${playerHealth}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <motion.div
            className="bg-black h-[70px] w-[140px] flex-shrink-0 flex items-center justify-center text-white"
            style={{
              border: "5px solid white",
              fontFamily: '"Press Start 2P", system-ui',
            }}
          >
            {timer}
          </motion.div>

          <div
            className="relative flex-1"
            style={{
              borderTop: "5px solid white",
              borderBottom: "5px solid white",
              borderRight: "5px solid white",
            }}
          >
            <div className="bg-red-500 h-10" />
            <motion.div
              className="bg-[#818cf8] absolute top-0 bottom-0 left-0 right-0"
              initial={{ width: "100%" }}
              animate={{ width: `${enemyHealth}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      </div>
      {gameText && (
        <motion.div
          className="text-white text-center flex items-center justify-center absolute inset-0 z-10"
          style={{
            transform: "translate(-50%, -50%)",
            fontFamily: '"Press Start 2P", system-ui',
            fontSize: "20px",
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {gameText}
        </motion.div>
      )}

      {end && (
        <button
          onClick={onReset}
          className="absolute z-10 bg-gray-100 opacity-75 text-black rounded-full shadow-lg flex items-center justify-center hover:bg-gray-200"
          style={{
            width: "50px",
            height: "50px",
            top: "40%",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <RefreshCcw className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default GameOverlay;
