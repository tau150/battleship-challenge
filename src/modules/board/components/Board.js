import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
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

      const notAvailableCells = this.props.cells.filter(
        cell => !cell.isAvailable
      );
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

      const coordinatesOfNotAvailableCells = notAvailableCells.map(cell =>
        _.pick(cell, ['xCoordinate', 'yCoordinate'])
      );

      let isPossibleMatch = true;

      coordinatesOfNotAvailableCells.forEach(cell => {
        cellsToHighlight.forEach(highLightedCell => {
          if (
            cell.xCoordinate === highLightedCell.xCoordinate &&
            cell.yCoordinate === highLightedCell.yCoordinate
          )
            isPossibleMatch = false;
        });
      });

      if (!isPossibleMatch) return;

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
    const renderCells = () => {
      if (this.props.owner === 'user') {
        return this.props.cells.map(cell => {
          return (
            <Cell
              key={cell.id}
              handleHoverToSetShip={this.handleHoverToSetShip}
              handleSetShipPosition={this.handleSetShipPosition}
              owner="user"
              xCoordinate={cell.xCoordinate}
              yCoordinate={cell.yCoordinate}
              type={cell.type}
              highlighted={cell.highlighted}
              available={cell.available}
            />
          );
        });
      }
      if (this.props.owner === 'cpu') {
        return this.props.cpuCells.map(cell => {
          return (
            <Cell
              key={cell.id}
              owner="cpu"
              xCoordinate={cell.xCoordinate}
              yCoordinate={cell.yCoordinate}
              type={cell.type}
              available={cell.available}
            />
          );
        });
      }
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
    cells: state.boardReducer.cells,
    cpuCells: state.boardReducer.cpuCells
  };
};

export default connect(
  mapStateToProps,
  { highlightPossibleSelection, setShipPosition }
)(Board);
