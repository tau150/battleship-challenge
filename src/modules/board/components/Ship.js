import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20%;
  cursor: pointer;

  i {
    color: ${({ type }) => (type === 'Carrier' ? '#2ECCFA' : '#0B3861')};
    color: ${({ type }) => (type === 'Cruisers' ? 'var(--primary)' : '')};
  }
  p {
    margin-bottom: 0;
    margin-left: 2%;
    font-weight: ${({ wasSelected }) => (wasSelected ? '700' : '')};
  }

  @media (min-width: 992px) {
    padding-left: 0;
    margin-top: 15px;

    i {
      font-size: ${({ wasSelected }) => (wasSelected ? '2.3rem' : '2rem')};
    }

    p {
      font-size: 1.2rem;
    }
  }
`;

const Ship = ({ type, id, handleSelectShip, direction, wasSelected }) => {
  return (
    <StyledDiv
      id={id}
      type={type}
      wasSelected={wasSelected}
      onClick={() => handleSelectShip({ id, type, direction })}
    >
      <i className="fa fa-ship" aria-hidden="true" />
      <p>{type}</p>
    </StyledDiv>
  );
};

export default Ship;
