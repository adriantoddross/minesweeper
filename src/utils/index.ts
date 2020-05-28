import { MAX_COLUMNS, MAX_ROWS } from "../constants";
import { CellValue, CellState, Cell } from "../types";

export const generateCells = () => {
  const cells: Cell = [];

  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLUMNS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.hidden
      })
    }
  }
};
