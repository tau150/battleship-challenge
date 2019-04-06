import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Board from '../../board/components/Board';

const TitleContainer = styled.div`
  margin-top: 3%;

  h2 {
    text-align: center;
  }
`;

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

class DashBoard extends Component {
  state = {
    playerName: '',
    validForm: true
  };

  handleChangePlayerName = e => {
    this.setState({ playerName: e.target.value, validForm: true });
  };

  handleSubmitStartGame = e => {
    e.preventDefault();
    if (!this.state.playerName) {
      this.setState({ validForm: false });
    } else {
      this.setState({ validForm: true });
    }
  };

  render() {
    const { playerName, validForm } = this.state;

    return (
      <React.Fragment>
        <div className="row">
          <TitleContainer className="col-12">
            <h2>Battleship</h2>
          </TitleContainer>
        </div>
        <div className="row mt-5">
          <div className="col-12 col-lg-6 d-flex justify-content-center">
            <Board />
          </div>

          <PlayerFormContainer className="col-12 col-lg-6">
            <form onSubmit={this.handleSubmitStartGame}>
              <div className="form-group pl-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your name"
                  value={playerName}
                  onChange={this.handleChangePlayerName}
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
        </div>
      </React.Fragment>
    );
  }
}

export default DashBoard;
