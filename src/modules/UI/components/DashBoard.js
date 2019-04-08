import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Board from '../../board/components/Board';
import PlayerForm from '../../board/components/PlayerForm';
import ShipSelection from '../../board/components/ShipsSelection';
import { startGame } from '../../game/actions';

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
    const { playerName } = this.props;

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
        return <Board />;
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
        <div className="row mt-5">
          <div className="col-12 col-lg-6 d-flex justify-content-center">
            <Board owner="user" />
          </div>
          <div className="col-12 col-lg-6">{renderRightSideContent()}</div>
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => {
  return {
    playerName: state.gameReducer.playerName,
    stage: state.gameReducer.stage
  };
};

export default connect(
  mapStateToProps,
  { startGame }
)(DashBoard);
