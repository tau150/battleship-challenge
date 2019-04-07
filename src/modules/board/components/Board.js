import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Row from './Row';
import { highlightPossibleSelection, setShipPosition } from '../actions';

const StyledDiv = styled.div`
  display: inline-block;
  border: 1.5px solid #777;
`;
class Board extends Component {
  handleHoverToSetShip = coordinates => {
    const { selectedShip } = this.props;
    if (selectedShip) {
      const cells = [];
      const { xCoordinate, yCoordinate } = coordinates;

      const makeCoordinatesObject = extension => {
        console.log(selectedShip.direction);
        if (selectedShip.direction === 'horizontal') {
          if (Number(yCoordinate) + extension <= 10) {
            for (let i = 0; i < extension; i += 1) {
              cells.push({
                xCoordinate: Number(xCoordinate),
                yCoordinate: Number(yCoordinate) + i
              });
            }
          }
        } else if (selectedShip.direction === 'vertical') {
          if (Number(xCoordinate) + extension <= 10) {
            for (let i = 0; i < extension; i += 1) {
              cells.push({
                xCoordinate: Number(xCoordinate) + i,
                yCoordinate: Number(yCoordinate)
              });
            }
          }
        }
      };

      if (selectedShip.type === 'Carrier') {
        makeCoordinatesObject(4);
      } else if (selectedShip.type === 'Cruisers') {
        makeCoordinatesObject(3);
      } else {
        makeCoordinatesObject(2);
      }

      this.props.highlightPossibleSelection(cells);
    }
  };

  handleSetShipPosition = () => {
    if (this.props.highlightedCells && this.props.highlightedCells.length > 0) {
      this.props.setShipPosition(
        this.props.ships,
        this.props.selectedShip,
        this.props.highlightedCells
      );
    }
  };

  render() {
    const renderRows = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
      position => (
        <Row
          highlightedCells={this.props.highlightedCells}
          handleHoverToSetShip={this.handleHoverToSetShip}
          key={position}
          handleSetShipPosition={this.handleSetShipPosition}
          rowIndex={position}
          stage={this.props.stage}
        />
      )
    );

    return <StyledDiv> {renderRows} </StyledDiv>;
  }
}

const mapStateToProps = state => {
  return {
    selectedShip: state.boardReducer.selectedShip,
    ships: state.boardReducer.ships,
    highlightedCells: state.boardReducer.highlightedCells,
    stage: state.gameReducer.stage
  };
};

export default connect(
  mapStateToProps,
  { highlightPossibleSelection, setShipPosition }
)(Board);
