import React from "react";

import "./Button.scss";
import { CellState, CellValue } from "../../types";

interface ButtonProps {
  row: number;
  column: number;
  state: CellState;
  value: CellValue;
  onClick(rowParam: number, columnParam: number): (...args: any[]) => void;
  onContext(rowParam: number, columnParam: number): (...args: any[]) => void;
}

const Button: React.FC<ButtonProps> = ({
  row,
  column,
  onClick,
  onContext,
  state,
  value,
}) => {
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
    <div
      className={`Button ${
        state === CellState.visible ? "visible" : ""
      } value-${value}`}
      onClick={onClick(row, column)}
      onContextMenu={onContext(row, column)}
    >
      {renderContent()}
    </div>
  );
};

export default Button;
