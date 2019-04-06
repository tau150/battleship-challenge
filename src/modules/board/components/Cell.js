import React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  width: 20px;
  height: 20px;
  border: 1px solid #eaeaea;
  background: var(--light);

  @media (min-width: 992px) {
    width: 40px;
    height: 40px;
  }
`;

const Cell = () => {
  return <StyledDiv />;
};

export default Cell;
