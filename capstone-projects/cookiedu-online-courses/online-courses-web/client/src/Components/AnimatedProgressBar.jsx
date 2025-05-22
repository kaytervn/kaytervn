import { useEffect, useState } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";

const AnimatedProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) =>
        prevProgress >= 100 ? 0 : prevProgress + 1
      );
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return <ProgressBar animated now={progress} />;
};

export default AnimatedProgressBar;
