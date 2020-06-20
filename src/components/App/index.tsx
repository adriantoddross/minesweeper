import React, { useEffect, useState } from "react";

import { generateCells } from "../../utils";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";
import { Face, Cell } from "../../types/";

import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells);
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = () => {
      return setFace(Face.oh);
    };
    const handleMouseUp = () => {
      return setFace(Face.smile);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (live) {
      const timer = setInterval(() => {
        setTime(time + 1);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [live, time]);

  const handleCellClick = (
    rowParam: number,
    columnParam: number
  ) => (): void => {
    if (!live) {
      setLive(true);
    }
  };

  const handleCellContext = (rowParam: number, columnParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();
  };

  const handleFaceClick = (): void => {
    if (live) {
      setLive(false);
      setTime(0);
      setCells(generateCells);
    }
  };

  const renderCells = (): React.ReactNode => {
    return cells?.map((row, rowIndex) =>
      row.map((cell, columnIndex) => {
        return (
          <Button
            key={`${rowIndex}-${columnIndex}`}
            state={cell.state}
            value={cell.value}
            onClick={handleCellClick}
            onContext={handleCellContext}
            row={rowIndex}
            column={columnIndex}
          />
        );
      })
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <span
          role="img"
          className="Face"
          aria-label="face emoji"
          onClick={handleFaceClick}
        >
          {face}
        </span>
        <NumberDisplay value={time} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
