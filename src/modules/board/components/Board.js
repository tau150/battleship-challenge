import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import Row from './Row';
import Cell from './Cell';
import { highlightPossibleSelection, setShipPosition } from '../actions';

const StyledDiv = styled.div`
  display: flex;
  border: 1.5px solid #777;
  flex-wrap: wrap;
  width: 203px;

  @media (min-width: 992px) {
    width: 406px;
  }
`;
class Board extends Component {
  handleHoverToSetShip = coordinates => {
    const { selectedShip } = this.props;
    if (selectedShip) {
      const cellsToHighlight = [];
      const { xCoordinate, yCoordinate } = coordinates;

      const availableCells = this.props.cells.filter(cell => cell.isAvailable);
      console.log(availableCells);
      const makeCoordinatesObject = extension => {
        if (selectedShip.direction === 'horizontal') {
          if (Number(yCoordinate) + extension <= 10) {
            for (let i = 0; i < extension; i += 1) {
              cellsToHighlight.push({
                xCoordinate: Number(xCoordinate),
                yCoordinate: Number(yCoordinate) + i
              });
            }
          }
        } else if (selectedShip.direction === 'vertical') {
          if (Number(xCoordinate) + extension <= 10) {
            for (let i = 0; i < extension; i += 1) {
              cellsToHighlight.push({
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

      this.props.highlightPossibleSelection(cellsToHighlight, this.props.cells);
    }
  };

  handleSetShipPosition = () => {
    if (
      this.props.highlightedCells &&
      this.props.highlightedCells.length > 0 &&
      this.props.selectedShip
    ) {
      this.props.setShipPosition(
        this.props.ships,
        this.props.selectedShip,
        this.props.highlightedCells,
        this.props.cells
      );
    }
  };

  render() {
    // const shipsOcupation = this.props.ships.map(ship => {
    //   return _.pick(ship, ['position']);
    // });

    // const renderRows = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
    //   position => (
    //     <Row
    //       // highlightedCells={this.props.highlightedCells}
    //       handleHoverToSetShip={this.handleHoverToSetShip}
    //       key={position}
    //       handleSetShipPosition={this.handleSetShipPosition}
    //       rowIndex={position}
    //       stage={this.props.stage}
    //     />
    //   )
    // );

    const renderCells = () => {
      return this.props.cells.map(cell => {
        return (
          <Cell
            key={cell.id}
            handleHoverToSetShip={this.handleHoverToSetShip}
            handleSetShipPosition={this.handleSetShipPosition}
            xCoordinate={cell.xCoordinate}
            yCoordinate={cell.yCoordinate}
            type={cell.type}
            highlighted={cell.highlighted}
            available={cell.available}
          />
        );
      });
    };

    return <StyledDiv> {renderCells()} </StyledDiv>;
  }
}

const mapStateToProps = state => {
  return {
    selectedShip: state.boardReducer.selectedShip,
    ships: state.boardReducer.ships,
    highlightedCells: state.boardReducer.highlightedCells,
    stage: state.gameReducer.stage,
    cells: state.boardReducer.cells
  };
};

export default connect(
  mapStateToProps,
  { highlightPossibleSelection, setShipPosition }
)(Board);
