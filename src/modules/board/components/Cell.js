import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid #eaeaea;
  background: var(--light);
  cursor: pointer;

  background: ${({ highlighted }) => (highlighted ? 'var(--secondary)' : '')};
  background: ${({ type }) => (type === 'Submarine' ? '#0B3861' : '')};
  background: ${({ type }) => (type === 'Cruisers' ? 'var(--primary) ' : '')};
  background: ${({ type }) => (type === 'Carrier' ? '#2ECCFA' : '')};
  @media (min-width: 992px) {
    width: 40px;
    height: 40px;
  }
`;

const Cell = ({
  highlighted,
  handleHoverToSetShip,
  available,
  type,
  yCoordinate,
  xCoordinate,
  handleSetShipPosition,
  owner
}) => {
  if (owner === 'user') {
    return (
      <StyledDiv
        type={type}
        available={available}
        highlighted={highlighted}
        onClick={handleSetShipPosition}
        onFocus={() => handleHoverToSetShip({ xCoordinate, yCoordinate })}
        onMouseOver={() => handleHoverToSetShip({ xCoordinate, yCoordinate })}
      />
    );
  }
  return <StyledDiv type={type} available={available} />;
};

export default Cell;
