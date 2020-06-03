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
        state: CellState.hidden,
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
  return cells;
};
