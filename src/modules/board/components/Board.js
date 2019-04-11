import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Cell from './Cell';
import { positionShip } from '../../../utils/helpers';

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
      const cellsToHighlight = positionShip(
        this.props.cells,
        selectedShip,
        coordinates.xCoordinate,
        coordinates.yCoordinate
      );
      if (cellsToHighlight) {
        this.props.highlightPossibleSelection(
          cellsToHighlight,
          this.props.cells
        );
      }
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
          const {
            id,
            xCoordinate,
            yCoordinate,
            type,
            condition,
            highlighted,
            available
          } = cell;
          return (
            <Cell
              key={id}
              id={id}
              owner="user"
              stage={this.props.stage}
              xCoordinate={xCoordinate}
              yCoordinate={yCoordinate}
              type={type}
              condition={condition}
              highlighted={highlighted}
              available={available}
              handleHoverToSetShip={this.handleHoverToSetShip}
              handleSetShipPosition={this.handleSetShipPosition}
            />
          );
        });
      }
      if (this.props.owner === 'cpu') {
        const { handleClickCpuBoard } = this.props;

        return this.props.cpuCells.map(cell => {
          const {
            id,
            xCoordinate,
            yCoordinate,
            type,
            condition,
            available
          } = cell;
          return (
            <Cell
              key={id}
              owner="cpu"
              id={id}
              condition={condition}
              xCoordinate={xCoordinate}
              yCoordinate={yCoordinate}
              type={type}
              available={available}
              handleClickCpuBoard={handleClickCpuBoard}
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
    cpuCells: state.boardReducer.cpuCells,
    cpuShips: state.boardReducer.cpuShips
  };
};

export default connect(
  mapStateToProps,
  { highlightPossibleSelection, setShipPosition }
)(Board);
