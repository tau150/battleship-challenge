import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const StyledDiv = styled.div`
  display: flex;
  width: content;
  justify-content: center;
  flex-wrap: nowrap;
`;

const Row = ({
  rowIndex,
  handleHoverToSetShip,
  highlightedCells,
  handleSetShipPosition
}) => {
  const renderRow = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
    position => {
      const highLight = () => {
        if (highlightedCells) {
          const result = highlightedCells.some(highlightedCell => {
            return (
              Number(highlightedCell.xCoordinate) === Number(rowIndex) &&
              Number(highlightedCell.yCoordinate) === Number(position)
            );
          });

          return result;
        }
      };
      return (
        <Cell
          handleHoverToSetShip={handleHoverToSetShip}
          key={position}
          xCoordinate={rowIndex}
          highlighted={highLight()}
          handleSetShipPosition={handleSetShipPosition}
          yCoordinate={position}
        />
      );
    }
  );

  return <StyledDiv>{renderRow}</StyledDiv>;
};

export default Row;
