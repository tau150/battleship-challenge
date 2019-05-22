import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import Board from '../../board/components/Board';
import PlayerForm from '../../board/components/PlayerForm';
import ShipSelection from '../../board/components/ShipsSelection';
import { startGame, finishGame, surrender } from '../../game/actions';
import { attackShip, changeStrategy, setTarget } from '../../board/actions';
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
  margin-left: 0;
  padding: 0;

  @media (min-width: 992px) {
    font-size: 1.6rem;
    margin-left: 80px;
    align-self: flex-start;
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
            <StyledP className="cpu-name">CPU</StyledP>
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

      let lastImpact;

      if (this.props.latestCpuImpacts.length > 0) {
        lastImpact = _.last(this.props.latestCpuImpacts);
      }

      let destroyedCell;

      if (lastImpact) {
        destroyedCell = this.props.userCells.find(
          cell =>
            cell.xCoordinate === lastImpact.xCoordinate &&
            cell.yCoordinate === lastImpact.yCoordinate
        );
      }
      let resetedTarget;
      // check updated value to evaluate if a ship was destroyed
      if (
        this.props.strategy === 'strategy' &&
        destroyedCell &&
        destroyedCell.condition === 'destroyed' &&
        !this.props.requireTargetReconfig
      ) {
        const damagedShips = this.props.userCells.filter(
          cell => cell.condition === 'damaged'
        );

        if (damagedShips.length > 0) {
          const randomDamagedShip = _.sample(damagedShips);
          resetedTarget = randomDamagedShip;
          this.props.changeStrategy('strategy', randomDamagedShip, true);
        } else {
          this.props.changeStrategy('random', null, true, false);
        }
      }

      if (this.props.strategy === 'random') {
        if (this.props.requireTargetReconfig) {
          const randomCell = _.sample(availableUserCells);
          this.props.attackShip(
            userTurn,
            randomCell,
            this.props.userCells,
            this.props.userShips,
            false
          );
        } else if (lastImpact && lastImpact.condition === 'damaged') {
          this.props.changeStrategy('strategy', lastImpact, false);
        } else {
          const randomCell = _.sample(availableUserCells);
          this.props.attackShip(
            userTurn,
            randomCell,
            this.props.userCells,
            this.props.userShips,
            false
          );
        }
      }

      if (
        (this.props.strategy === 'strategy' &&
          destroyedCell.condition !== 'destroyed') ||
        (this.props.strategy === 'strategy' && resetedTarget)
      ) {
        let { possibleDirectionsForTarget } = this.props;
        const { lastDirection } = this.props;
        const directionToApply = lastDirection;

        const updatedAvailableUserCells = this.props.userCells.filter(
          cell => cell.condition === null
        );

        const target = resetedTarget || this.props.target;

        if (lastImpact.condition === 'water') {
          possibleDirectionsForTarget = getPossibleDirections(
            updatedAvailableUserCells,
            this.props.target
          );
        } else if (resetedTarget) {
          possibleDirectionsForTarget = getPossibleDirections(
            updatedAvailableUserCells,
            resetedTarget
          );
        } else {
          const lastImpactTocalculate = this.props.requireTargetReconfig
            ? target
            : lastImpact;

          possibleDirectionsForTarget = getPossibleDirections(
            updatedAvailableUserCells,
            lastImpactTocalculate
          );
        }

        if (possibleDirectionsForTarget.length === 0) {
          this.props.changeStrategy('random', null, true);
        }

        const nextImpact = calculateNextImpact(
          target,
          lastImpact,
          possibleDirectionsForTarget,
          directionToApply,
          this.props.latestCpuImpacts,
          this.props.latestDirections,
          !!resetedTarget
        );

        this.props.attackShip(
          userTurn,
          nextImpact,
          this.props.userCells,
          this.props.userShips,
          possibleDirectionsForTarget,
          false
        );
      }
    }

    return (
      <React.Fragment>
        <div className="row">
          <TitleContainer className="col-12">
            <h2>Battleship</h2>
          </TitleContainer>
        </div>

        {winner ? (
          <WinnerBoard winner={winner === 'user' ? 'You' : 'Machine'} />
        ) : (
          <StyledGeneralContainer className="row mt-1">
            <div className="col-12 col-lg-6 d-flex flex-column align-items-center justify-content-center">
              <StyledP>
                {this.props.stage === 'battle' ? playerName : ''}
              </StyledP>
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
    lastImpact: state.boardReducer.lastImpact,
    possibleDirectionsForTarget: state.boardReducer.possibleDirectionsForTarget,
    requireTargetReconfig: state.boardReducer.requireTargetReconfig,
    resetTarget: state.boardReducer.resetTarget,
    latestDirections: state.boardReducer.latestDirections,
    usedTargets: state.boardReducer.usedTargets
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
    setTarget
  }
)(DashBoard);
