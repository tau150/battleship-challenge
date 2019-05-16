import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import Board from '../../board/components/Board';
import PlayerForm from '../../board/components/PlayerForm';
import ShipSelection from '../../board/components/ShipsSelection';
import { startGame, finishGame, surrender } from '../../game/actions';
import {
  attackShip,
  changeStrategy,
  changeDirection,
  changeGameMode,
  setTarget
} from '../../board/actions';
import {
  calculateNextImpact,
  getPossibleDirections
} from '../../../utils/helpers';
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
    font-size: 1.6rem;
    margin-left: 80px;
  }
  &.cpu-name {
    margin-left: 0;
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

  // componentDidUpdate() {
  //   // const {
  //   //   userTurn,
  //   //   userCells,
  //   //   userShips,
  //   //   latestCpuImpacts,
  //   //   cpuDestroyedShips,
  //   //   userDestroyedShips
  //   // } = this.props;
  //   // if (cpuDestroyedShips === 5) {
  //   //   this.props.finishGame('user');
  //   // }
  //   // if (userDestroyedShips === 5) {
  //   //   this.props.finishGame('cpu');
  //   // }
  //   // RANDOM
  //   // if (!userTurn) {
  //   //   let availableCell = false;
  //   //   while (!availableCell) {
  //   //     const randomCell = _.sample(userCells);
  //   //     if (randomCell.condition === null) {
  //   //       this.props.attackShip(userTurn, randomCell, userCells, userShips);
  //   //       availableCell = true;
  //   //     }
  //   //   }
  //   // }
  //   // if (!userTurn) {
  //   //   const availableUserCells = this.props.userCells.filter(
  //   //     cell => cell.condition === null
  //   //   );
  //   //   let lastImpactCondition = null;
  //   //   let lastImpact;
  //   //   if (latestCpuImpacts.length > 0) {
  //   //     lastImpact = _.last(latestCpuImpacts);
  //   //     lastImpactCondition = lastImpact.condition;
  //   //   }
  //   //   // if (this.props.target) {
  //   //   // }
  //   //   if (this.props.strategy === 'random') {
  //   //     console.log(this.props.latestCpuImpacts);
  //   //     if (lastImpactCondition === 'damaged') {
  //   //       this.props.changeGameMode('strategy', lastImpact);
  //   //     } else {
  //   //       const randomCell = _.sample(availableUserCells);
  //   //       this.props.attackShip(userTurn, randomCell, userCells, userShips);
  //   //     }
  //   //   }
  //   //   if (this.props.strategy === 'strategy') {
  //   //     let directionToApply = this.props.lastDirection;
  //   //     const possibleDirections = getPossibleDirections(
  //   //       availableUserCells,
  //   //       this.props.target
  //   //     );
  //   //     if (lastImpactCondition === 'water') {
  //   //       possibleDirections.filter(
  //   //         direction => direction !== this.props.lastDirection
  //   //       );
  //   //       directionToApply = _.sample(possibleDirections);
  //   //     }
  //   //     const nextImpact = calculateNextImpact(
  //   //       this.props.target,
  //   //       lastImpact,
  //   //       possibleDirections,
  //   //       directionToApply
  //   //     );
  //   //     this.props.attackShip(userTurn, nextImpact, userCells, userShips);
  //   //   }
  //   // }
  // }

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

    if (this.props.cpuDestroyedShips === 5) {
      this.props.finishGame('user');
    }

    if (this.props.userDestroyedShips === 5) {
      this.props.finishGame('cpu');
    }

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
            <StyledP className="align-self-start cpu-name">CPU</StyledP>
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

    if (!userTurn) {
      const availableUserCells = this.props.userCells.filter(
        cell => cell.condition === null
      );

      let lastImpactCondition = null;
      let lastImpact;
      if (this.props.latestCpuImpacts.length > 0) {
        lastImpact = _.last(this.props.latestCpuImpacts);
        lastImpactCondition = lastImpact.condition;
      }
      if (this.props.target && this.props.target.condition === 'destroyed') {
        this.props.changeGameMode('random', null);
      }

      if (this.props.strategy === 'random') {
        if (lastImpactCondition === 'damaged') {
          this.props.changeGameMode('strategy', lastImpact);
        } else {
          const randomCell = _.sample(availableUserCells);
          this.props.attackShip(
            userTurn,
            randomCell,
            this.props.userCells,
            this.props.userShips
          );
        }
      }
      if (this.props.strategy === 'strategy') {
        let directionToApply = this.props.lastDirection; // null
        const possibleDirections = getPossibleDirections(
          availableUserCells,
          this.props.target
        );

        if (lastImpactCondition === 'water') {
          lastImpact = null;
          possibleDirections.filter(
            direction => direction !== this.props.lastDirection
          );
          directionToApply = _.sample(possibleDirections);
        }

        const nextImpact = calculateNextImpact(
          this.props.target,
          lastImpact,
          possibleDirections,
          directionToApply
        );
        this.props.attackShip(
          userTurn,
          nextImpact,
          this.props.userCells,
          this.props.userShips
        );
      }
    }

    console.log('user turn', this.props.latestCpuImpacts);

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
    latestCpuImpacts: state.boardReducer.latestCpuImpacts,
    strategy: state.boardReducer.strategy,
    lastDirection: state.boardReducer.lastDirection,
    changedDirection: state.boardReducer.changedDirection,
    target: state.boardReducer.target,
    lastImpact: state.boardReducer.lastImpact
  };
};

export default connect(
  mapStateToProps,
  {
    startGame,
    attackShip,
    finishGame,
    surrender,
    changeStrategy,
    changeDirection,
    changeGameMode,
    setTarget
  }
)(DashBoard);
