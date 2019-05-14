import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import Board from '../../board/components/Board';
import PlayerForm from '../../board/components/PlayerForm';
import ShipSelection from '../../board/components/ShipsSelection';
import { startGame, finishGame, surrender } from '../../game/actions';
import { attackShip } from '../../board/actions';
import { calculateNextImpact } from '../../../utils/helpers';
import WinnerBoard from './WinnerBoard';
import StateFooter from '../../board/components/StateFooter';

const TitleContainer = styled.div`
  margin-top: 3%;

  h2 {
    text-align: center;
  }
`;

const StyledDiv = styled.div`

  margin-right: 0;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;


  @media(min-width: 992px){
    margin-top: 0;
    display: block;
  })
`;

const StyledP = styled.p`
  font-size: 1.4rem;
  color: var(--secondary);
  margin-left: 60px;
  padding: 0;

  @media (min-width: 992px) {
    font-size: 2rem;
    margin-left: 80px;
  }
`;

const StyledGeneralContainer = styled.div`
  margin-top: 50px;

  @media (min-width: 992px) {
    padding-top: 50px;
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
      latestCpuImpacts,
      cpuDestroyedShips,
      userDestroyedShips
    } = this.props;

    if (cpuDestroyedShips === 5) {
      this.props.finishGame('user');
    }

    if (userDestroyedShips === 5) {
      this.props.finishGame('cpu');
    }

    console.log(latestCpuImpacts);

    // RANDOM
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

    // if (!userTurn) {
    //   let lastImpactCondition = null;
    //   let lastImpact;
    //   if (latestCpuImpacts.length > 0) {
    //     lastImpact = _.last(latestCpuImpacts);
    //     lastImpactCondition = lastImpact.condition;
    //   }

    //   if (lastImpactCondition !== 'damaged') {
    //     let availableCell = false;
    //     while (!availableCell) {
    //       const randomCell = _.sample(userCells);
    //       if (randomCell.condition === null) {
    //         this.props.attackShip(userTurn, randomCell, userCells, userShips);
    //         availableCell = true;
    //       }
    //     }
    //   } else {
    //     const nextImpact = calculateNextImpact(lastImpact);
    //   }

    //   // console.log(latestCpuImpacts);
    //   // const randomCell2 = _.sample(userCells);
    //   // this.props.attackShip(userTurn, randomCell2, userCells, userShips);
    // }
  }

  handleSurrender = () => {
    this.props.surrender();
  };

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

  // handleRestartGame = () => {
  //   this.props.restartGame();
  // };

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
        return (
          <StyledDiv>
            <StyledP className="align-self-start">CPU</StyledP>
            <Board owner="cpu" handleClickCpuBoard={handleClickCpuBoard} />
            {this.props.stage === 'battle' ? (
              <StateFooter
                playerName={this.props.playerName}
                userTurn={this.props.userTurn}
                handleSurrender={this.props.surrender}
              />
            ) : (
              ''
            )}
          </StyledDiv>
        );
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
          <StyledGeneralContainer className="row mt-2">
            <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center">
              <StyledP className="align-self-start">{playerName}</StyledP>
              <Board owner="user" />
            </div>
            <div className="col-12 col-lg-6">{renderRightSideContent()}</div>
          </StyledGeneralContainer>
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
    winner: state.gameReducer.winner,
    latestCpuImpacts: state.boardReducer.latestCpuImpacts
  };
};

export default connect(
  mapStateToProps,
  { startGame, attackShip, finishGame, surrender }
)(DashBoard);
