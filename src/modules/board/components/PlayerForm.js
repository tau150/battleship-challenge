import React from 'react';
import styled from 'styled-components';

const PlayerFormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 5%;
  @media (min-width: 992px) {
    align-items: flex-start;
  }
`;

const PlayerForm = ({
  name,
  validForm,
  handleSubmitStartGame,
  handleChangePlayerName
}) => {
  return (
    <PlayerFormContainer className="col-12 col-lg-6">
      <form onSubmit={handleSubmitStartGame}>
        <div className="form-group pl-0">
          <input
            type="text"
            className="form-control"
            placeholder="Enter your name"
            value={name}
            onChange={handleChangePlayerName}
          />
          {!validForm ? (
            <p className="text-danger">
              {' '}
              You must to enter your name to play.{' '}
            </p>
          ) : (
            ''
          )}
        </div>
        <button type="submit" className="btn btn-outline-primary">
          START GAME
        </button>
      </form>
    </PlayerFormContainer>
  );
};

export default PlayerForm;
