import React from "react";

import "./Button.scss";
import { CellState, CellValue } from "../../types";

interface ButtonProps {
  row: number;
  column: number;
  state: CellState;
  value: CellValue;
}

const Button: React.FC<ButtonProps> = ({ row, column, state, value }) => {
  const renderContent = (): React.ReactNode => {
    if (state === CellState.visible) {
      if (value === CellValue.bomb) {
        return (
          <span role="img" className="Bomb" aria-label="bomb emoji">
            💣
          </span>
        );
      } else if (value === CellValue.none) {
        return null;
      }
      return value;
    } else if (state === CellState.flagged) {
      return (
        <span role="img" className="Bomb" aria-label="bomb emoji">
          🚩
        </span>
      );
    }
    return null;
  };
  return (
    <div className={`Button ${state === CellState.visible ? "visible" : ""} value-${value}`}>
      {renderContent()}
    </div>
  );
};

export default Button;
