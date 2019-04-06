import React, { Component } from 'react';
import styled from 'styled-components';
import Row from './Row';

const StyledDiv = styled.div`
  display: inline-block;
  border: 1.5px solid #777;
`;
class Board extends Component {
  render() {
    const renderRows = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
      position => <Row key={position} rowIndex={position} />
    );

    return <StyledDiv> {renderRows} </StyledDiv>;
  }
}

export default Board;
