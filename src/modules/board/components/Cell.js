import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid #eaeaea;
  background: var(--light);
  cursor: pointer;

  background: ${({ highlighted }) => (highlighted ? 'var(--secondary)' : '')};

  @media (min-width: 992px) {
    width: 40px;
    height: 40px;
  }
`;

const Cell = ({
  highlighted,
  handleHoverToSetShip,
  yCoordinate,
  xCoordinate,
  handleSetShipPosition
}) => {
  return (
    <StyledDiv
      highlighted={highlighted}
      onClick={handleSetShipPosition}
      onFocus={() => handleHoverToSetShip({ xCoordinate, yCoordinate })}
      onMouseOver={() => handleHoverToSetShip({ xCoordinate, yCoordinate })}
    />
  );
};

export default Cell;
