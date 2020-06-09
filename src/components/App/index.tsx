import React, { useState } from "react";

import { generateCells } from "../../utils";
import NumberDisplay from "../NumberDisplay";
import Button from "../Button";

import "./App.scss";

const App: React.FC = () => {
  const [cells, setCells] = useState(generateCells);

  const renderCells = (): React.ReactNode => {
    return cells.map((row, rowIndex) =>
      row.map((cell, columnIndex) => {
        return <Button key={`${rowIndex}-${columnIndex}`} state={cell.state} value={cell.value} row={rowIndex} column={columnIndex}/>;
      })
    );
  };

  return (
    <div className="App">
      <div className="Header">
        <NumberDisplay value={0} />
        <span role="img" className="Face" aria-label="face emoji">
          😁
        </span>
        <NumberDisplay value={23} />
      </div>
      <div className="Body">{renderCells()}</div>
    </div>
  );
};

export default App;
