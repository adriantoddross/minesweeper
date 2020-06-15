import { MAX_COLUMNS, MAX_ROWS, NUMBER_OF_BOMBS } from "../constants";
import { CellValue, CellState, Cell } from "../types";

export const generateCells = () => {
  let cells: Cell[][] = [];

  // Generate all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLUMNS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.visible, // Hide this after testing!
      });
    }
  }

  // Randomly place 10 bombs.
  let bombsPlaced = 0;
  while (bombsPlaced < NUMBER_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomColumn = Math.floor(Math.random() * MAX_COLUMNS);

    const currentCell = cells[randomRow][randomColumn];
    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, columnIndex) => {
          if (randomRow === rowIndex && randomColumn === columnIndex) {
            return {
              ...cell,
              value: CellValue.bomb,
            };
          }
          return cell;
        })
      );
      bombsPlaced++;
    }
  }

  // Calculate numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let columnIndex = 0; columnIndex < MAX_COLUMNS; columnIndex++) {
      const currentCell = cells[rowIndex][columnIndex];

      if (currentCell.value === CellValue.bomb) {
        continue;
      }
      let numberOfBombs = 0;
      const topLeftBomb =
        rowIndex > 0 && columnIndex > 0
          ? cells[rowIndex - 1][columnIndex - 1]
          : null;
      const topBomb = rowIndex > 0 ? cells[rowIndex - 1][columnIndex] : null;
      const topRightBomb =
        rowIndex > 0 && columnIndex < MAX_COLUMNS - 1
          ? cells[rowIndex - 1][columnIndex + 1]
          : null;
      const leftBomb =
        columnIndex > 0 ? cells[rowIndex][columnIndex - 1] : null;
      const rightBomb =
        columnIndex < MAX_COLUMNS - 1 ? cells[rowIndex][columnIndex + 1] : null;
      const bottomLeftBomb =
        rowIndex < MAX_ROWS - 1 && columnIndex > 0
          ? cells[rowIndex + 1][columnIndex - 1]
          : null;
      const bottomBomb =
        rowIndex < MAX_ROWS - 1 ? cells[rowIndex + 1][columnIndex] : null;
      const bottomRightBomb =
        rowIndex < MAX_ROWS - 1 && columnIndex < MAX_COLUMNS - 1
          ? cells[rowIndex + 1][columnIndex + 1]
          : null;
    }
  }

  return cells;
};
