import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  margin-top: 30px;

  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  p {
    color: #777;
    margin-bottom: 0;
    margin-right: 10px;
  }

  @media (min-width: 992px) {
    width: 440px;
    position: absolute;
  }
`;

const StateFooter = ({ playerName, userTurn, handleSurrender }) => {
  return (
    <StyledDiv>
      <p>
        Playing: <strong> {userTurn ? playerName : 'CPU'} </strong>{' '}
      </p>
      <button
        onClick={() => handleSurrender()}
        className="btn btn-outline-secondary"
        type="button"
      >
        {' '}
        SURRENDER
      </button>
    </StyledDiv>
  );
};

export default StateFooter;
