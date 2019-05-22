import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    color: orange;
    text-align: center;
    margin-top: 80px;
  }

  button {
    margin-top: 30px;
  }
`;

const WinnerBoard = ({ winner }) => {
  return (
    <StyledDiv>
      <h1> {winner} won the battle! </h1>
    </StyledDiv>
  );
};

export default WinnerBoard;
