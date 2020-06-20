import React, { useEffect, useState } from "react";

import { generateCells, openMultipleCells } from "../../utils";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";
import { Face, Cell, CellState, CellValue } from "../../types/";

import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells);
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(10);

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
    if (live && time < 999) {
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
      // Make sure you don't click on a bomb!
      setLive(true);
    }

    let currentCell = cells[rowParam][columnParam];
    let newCells = cells.slice();

    if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      // handle bomb clicc
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, columnParam);
      setCells(newCells);
    } else {
      newCells[rowParam][columnParam].state = CellState.visible;
      setCells(newCells);
    }
  };

  const handleCellContext = (rowParam: number, columnParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    const currentCells = cells.slice();
    const currentCell = cells[rowParam][columnParam];

    if (currentCell.state === CellState.visible) {
      return;
    } else if (currentCell.state === CellState.hidden) {
      if (!live) {
        return;
      }
      currentCells[rowParam][columnParam].state = CellState.flagged;
      setCells(currentCells);
      setBombCounter(bombCounter - 1);
    } else if (currentCell.state === CellState.flagged) {
      currentCells[rowParam][columnParam].state = CellState.visible;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }
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
        <NumberDisplay value={bombCounter} />
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
