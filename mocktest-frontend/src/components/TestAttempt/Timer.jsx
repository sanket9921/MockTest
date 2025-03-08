import { useState, useEffect } from "react";
import { getRemainingTime } from "../../services/testAttemptService";

const Timer = ({ attemptId, onTimeUp }) => {
  const [remainingTime, setRemainingTime] = useState(null);

  useEffect(() => {
    const fetchRemainingTime = async () => {
      const data = await getRemainingTime(attemptId);
      //   const data = await response.json();

      if (data.remainingTime === null) {
        // No time limit
        setRemainingTime(null);
      } else {
        setRemainingTime(data.remainingTime);
      }
    };

    fetchRemainingTime();

    const timer = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime === null) return null; // No time limit case
        if (prevTime <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [attemptId, onTimeUp]);

  if (remainingTime === null) {
    return (
      <div className="text-xl font-bold text-green-600">No Time Limit</div>
    );
  }

  return (
    <div className="text-xl font-bold">
      Time Left: {Math.floor(remainingTime / 60)}:{remainingTime % 60}
    </div>
  );
};

export default Timer;
