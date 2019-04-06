import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Ship from './Ship';
import { initShips } from '../actions';

const SyledH2 = styled.h2`
  color: var(--gray);
  font-size: 1.4rem;
  margin-top: 5%;
  text-align: center;

  @media (min-width: 992px) {
    margin-top: 0;
    text-align: left;
    margin-bottom: 3%;
  }
`;

class ShipSelection extends Component {
  componentDidMount() {
    this.props.initShips();
  }

  handleSelectShip = () => {};

  render() {
    const { playerName, ships } = this.props;

    const renderShips = () => {
      return ships.map(ship => {
        return (
          <Ship
            handleSelectShip={this.handleSelectShip}
            key={ship.id}
            type={ship.type}
            idReference={ship.id}
            position={ship.position}
          />
        );
      });
    };

    return (
      <div className="col-12 col-lg-6">
        <div>
          <SyledH2>Hi {playerName}, these is your army</SyledH2>
        </div>
        <div>{renderShips()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ships: state.boardReducer.ships
  };
};

export default connect(
  mapStateToProps,
  { initShips }
)(ShipSelection);
