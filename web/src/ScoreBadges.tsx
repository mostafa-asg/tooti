import React from "react";
import "./ScoreBadges.css";

interface ScoreBadgesProps {
  correctCount: number,
  wrongCount: number
}
const ScoreBadges: React.FC<ScoreBadgesProps> = ({ correctCount, wrongCount }) => {
  return (
    <div className="score-badges-container">
      <div className="score-badge green-badge">
        <span className="score-value">{correctCount}</span>
      </div>
      <div className="score-badge red-badge">
        <span className="score-value">{wrongCount}</span>
      </div>
    </div>
  );
}

export default ScoreBadges;