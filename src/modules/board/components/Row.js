import React from 'react';
import styled from 'styled-components';
import Cell from './Cell';

const StyledDiv = styled.div`
  display: flex;
  width: content;
  justify-content: center;
  flex-wrap: nowrap;
`;

const Row = ({ rowIndex }) => {
  const renderRow = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
    position => {
      return (
        <Cell key={position} y-coordinate={rowIndex} x-coordinate={position} />
      );
    }
  );

  return <StyledDiv>{renderRow}</StyledDiv>;
};

export default Row;
