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
  background: ${({ stage }) => (stage === 'battle' ? '#fff' : '')};
  border: ${({ type, stage }) =>
    type === 'Submarine' && stage === 'battle' ? '1.5px solid #0B3861' : ''};
  border: ${({ type, stage }) =>
    type === 'Cruisers' && stage === 'battle'
      ? '1.5px solid var(--primary) '
      : ''};
  border: ${({ type, stage }) =>
    type === 'Carrier' && stage === 'battle' ? '1.5px solid #2ECCFA' : ''};

  background: ${({ condition }) => (condition === 'damaged' ? 'orange' : '')};
  background: ${({ condition }) => (condition === 'destroyed' ? 'red' : '')};
  background: ${({ condition }) => (condition === 'water' ? '#AAF6FF' : '')};

  @media (min-width: 992px) {
    width: 40px;
    height: 40px;
  }
`;

const Cell = ({
  highlighted,
  available,
  type,
  yCoordinate,
  xCoordinate,
  owner,
  id,
  condition,
  handleClickCpuBoard,
  handleHoverToSetShip,
  stage,
  handleSetShipPosition
}) => {
  if (owner === 'user') {
    return (
      <StyledDiv
        type={type}
        available={available}
        stage={stage}
        condition={condition}
        highlighted={highlighted}
        onClick={handleSetShipPosition}
        onFocus={() => handleHoverToSetShip({ xCoordinate, yCoordinate })}
        onMouseOver={() => handleHoverToSetShip({ xCoordinate, yCoordinate })}
      />
    );
  }

  return (
    <StyledDiv
      onClick={() =>
        handleClickCpuBoard(xCoordinate, yCoordinate, id, condition)
      }
      type={type}
      condition={condition}
      xCoordinate={xCoordinate}
      yCoordinate={yCoordinate}
      available={available}
    />
  );
};

export default Cell;
