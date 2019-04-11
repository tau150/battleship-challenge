import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import Board from '../../board/components/Board';
import PlayerForm from '../../board/components/PlayerForm';
import ShipSelection from '../../board/components/ShipsSelection';
import { startGame, finishGame, restartGame } from '../../game/actions';
import { attackShip } from '../../board/actions';
import WinnerBoard from './WinnerBoard';

const TitleContainer = styled.div`
  margin-top: 3%;

  h2 {
    text-align: center;
  }
`;

class DashBoard extends Component {
  state = {
    name: '',
    validForm: true
  };

  componentDidUpdate() {
    const {
      userTurn,
      userCells,
      userShips,
      cpuDestroyedShips,
      userDestroyedShips
    } = this.props;

    if (cpuDestroyedShips === 5) {
      this.props.finishGame('user');
    }

    if (userDestroyedShips === 5) {
      this.props.finishGame('cpu');
    }

    if (!userTurn) {
      let availableCell = false;

      while (!availableCell) {
        const randomCell = _.sample(userCells);
        if (randomCell.condition === null) {
          this.props.attackShip(userTurn, randomCell, userCells, userShips);
          availableCell = true;
        }
      }
    }
  }

  handleChangePlayerName = e => {
    this.setState({ name: e.target.value, validForm: true });
  };

  handleSubmitStartGame = e => {
    e.preventDefault();
    if (!this.state.name) {
      this.setState({ validForm: false });
    } else {
      this.props.startGame(this.state.name);
    }
  };

  handleRestartGame = () => {
    this.props.restartGame();
  };

  render() {
    const { name, validForm } = this.state;
    const { playerName, userTurn, cpuCells, cpuShips, winner } = this.props;

    const handleClickCpuBoard = (xCoordinate, yCoordinate) => {
      if (userTurn) {
        const cellClicked = cpuCells.find(
          cell =>
            cell.xCoordinate === xCoordinate && cell.yCoordinate === yCoordinate
        );

        if (cellClicked.condition === null) {
          this.props.attackShip(userTurn, cellClicked, cpuCells, cpuShips);
        }
      }
    };
    const renderRightSideContent = () => {
      if (!playerName) {
        return (
          <PlayerForm
            name={name}
            validForm={validForm}
            handleChangePlayerName={this.handleChangePlayerName}
            handleSubmitStartGame={this.handleSubmitStartGame}
          />
        );
      }
      if (this.props.stage === 'battle') {
        return <Board owner="cpu" handleClickCpuBoard={handleClickCpuBoard} />;
      }
      return <ShipSelection playerName={playerName} />;
    };

    return (
      <React.Fragment>
        <div className="row">
          <TitleContainer className="col-12">
            <h2>Battleship</h2>
          </TitleContainer>
        </div>

        {winner ? (
          <WinnerBoard
            handleRestartGame={this.handleRestartGame}
            winner={winner === 'user' ? 'You' : 'Machine'}
          />
        ) : (
          <div className="row mt-5">
            <div className="col-12" />
            <div className="col-12 col-lg-6 d-flex justify-content-center">
              <Board owner="user" />
            </div>
            <div className="col-12 col-lg-6">{renderRightSideContent()}</div>
          </div>
        )}
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    playerName: state.gameReducer.playerName,
    stage: state.gameReducer.stage,
    userDestroyedShips: state.boardReducer.userDestroyedShips,
    cpuDestroyedShips: state.boardReducer.cpuDestroyedShips,
    userShips: state.boardReducer.ships,
    userCells: state.boardReducer.cells,
    cpuCells: state.boardReducer.cpuCells,
    cpuShips: state.boardReducer.cpuShips,
    userTurn: state.gameReducer.userTurn,
    winner: state.gameReducer.winner
  };
};

export default connect(
  mapStateToProps,
  { startGame, attackShip, finishGame, restartGame }
)(DashBoard);
