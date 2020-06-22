import React, { useEffect, useState } from "react";

import { generateCells, openMultipleCells } from "../../utils";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";
import { Face, Cell, CellState, CellValue } from "../../types/";

import "./App.scss";
import { MAX_ROWS, MAX_COLUMNS } from "../../constants";

const App: React.FC = () => {
  const [cells, setCells] = useState<Cell[][]>(generateCells);
  const [face, setFace] = useState<Face>(Face.smile);
  const [time, setTime] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [bombCounter, setBombCounter] = useState<number>(10);
  const [hasLost, setHasLost] = useState<boolean>(false);
  const [hasWon, setHasWon] = useState<boolean>(false);

  useEffect(() => {
    const handleMouseDown = () => {
      if (hasLost) return;
      return setFace(Face.oh);
    };
    const handleMouseUp = () => {
      if (hasLost) return;
      return setFace(Face.smile);
    };

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [hasLost]);

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

  useEffect(() => {
    if (hasLost) {
      setLive(false);
      setFace(Face.lost);
    }
  }, [hasLost]);

  useEffect(() => {
    if (hasWon) {
      setLive(false);
      setFace(Face.won);
    }
  }, [hasWon]);

  const handleCellClick = (
    rowParam: number,
    columnParam: number
  ) => (): void => {
    let newCells = cells.slice();
    let currentCell = newCells[rowParam][columnParam];

    if (hasLost) return;
    // start the game!
    if (!live) {
      while (currentCell.value === CellValue.bomb) {
        console.warn("Hit a bomb!");
        newCells = generateCells();
        currentCell = newCells[rowParam][columnParam];
      }
      setLive(true);
    }

    if ([CellState.flagged, CellState.visible].includes(currentCell.state)) {
      return;
    }

    if (currentCell.value === CellValue.bomb) {
      setHasLost(true);
      newCells[rowParam][columnParam].red = true;
      newCells = showAllBombs();
      setCells(newCells);
      return;
    } else if (currentCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, columnParam);
      setCells(newCells);
    } else {
      newCells[rowParam][columnParam].state = CellState.visible;
      setCells(newCells);
    }

    // Check to see if you have won!
    let safeOpenCellsExists: boolean = false;
    for (let row = 0; row < MAX_ROWS; row++) {
      for (let column = 0; column < MAX_COLUMNS; column++) {
        const currentCell = newCells[row][column];

        if (
          currentCell.value === CellValue.bomb &&
          currentCell.state === CellState.hidden
        ) {
          safeOpenCellsExists = true;
          break;
        }
      }
    }
    if (!safeOpenCellsExists) {
      newCells = newCells.map((row) =>
        row.map((cell) => {
          if (cell.value === CellValue.bomb) {
            return {
              ...cell,
              state: CellState.flagged,
            };
          }
          return cell;
        })
      );
      setHasWon(true);
    }
    setCells(newCells);
  };

  const handleCellContext = (rowParam: number, columnParam: number) => (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ): void => {
    e.preventDefault();

    let newCells = cells.slice();
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
      if (currentCell.value === CellValue.bomb) {
        setHasLost(true);
        newCells[rowParam][columnParam].red = true;
        newCells = showAllBombs();
        setCells(newCells);
        return;
      }

      currentCells[rowParam][columnParam].state = CellState.visible;
      setCells(currentCells);
      setBombCounter(bombCounter + 1);
    }
  };

  const handleFaceClick = (): void => {
    setLive(false);
    setTime(0);
    setBombCounter(10);
    setCells(generateCells);
    setHasLost(false);
    setHasWon(false);
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
            red={cell.red}
            row={rowIndex}
            column={columnIndex}
          />
        );
      })
    );
  };

  const showAllBombs = (): Cell[][] => {
    const currentCells = cells.slice();
    return currentCells.map((row) =>
      row.map((cell) => {
        if (cell.value === CellValue.bomb) {
          return {
            ...cell,
            state: CellState.visible,
          };
        }
        return cell;
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
