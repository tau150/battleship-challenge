import React, { Component } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import _ from 'lodash';
import Cell from './Cell';

const StyledDiv = styled.div`
  display: flex;
  width: content;
  justify-content: center;
  flex-wrap: nowrap;
`;

class Row extends Component {
  render() {
    const {
      rowIndex,
      handleHoverToSetShip,
      highlightedCells,
      handleSetShipPosition,
      positionedShip,
      ships
    } = this.props;

    // console.log(shipsOcupation);

    const renderRow = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
      position => {
        const isAvailable = () => {
          ships.map(ship => {
            if (ship.position) {
              return !!(
                ship.position.xCoordinate !== rowIndex &&
                ship.position.yCoordinate !== position
              );
            }
            return false;
          });
        };

        const highLight = () => {
          if (highlightedCells) {
            return _.find(highlightedCells, cell => {
              return (
                Number(cell.xCoordinate) === Number(rowIndex) &&
                Number(cell.yCoordinate) === Number(position)
              );
            });
          }
        };

        const fill = () => {
          if (positionedShip) {
            return highlightedCells.some(highlightedCell => {
              return (
                Number(highlightedCell.xCoordinate) === Number(rowIndex) &&
                Number(highlightedCell.yCoordinate) === Number(position)
              );
            });
          }
        };

        const shipType = () => {
          if (positionedShip) {
            return highlightedCells.some(highlightedCell => {
              return (
                Number(highlightedCell.xCoordinate) === Number(rowIndex) &&
                Number(highlightedCell.yCoordinate) === Number(position)
              );
            });
          }
        };

        return (
          <Cell
            handleHoverToSetShip={handleHoverToSetShip}
            key={position}
            available={isAvailable()}
            xCoordinate={rowIndex}
            highlighted={highLight()}
            fill={fill()}
            type={shipType()}
            handleSetShipPosition={handleSetShipPosition}
            yCoordinate={position}
          />
        );
      }
    );

    return <StyledDiv>{renderRow}</StyledDiv>;
  }
}
// const Row = ({
//   rowIndex,
//   handleHoverToSetShip,
//   highlightedCells,
//   handleSetShipPosition
// }) => {
//   const renderRow = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
//     position => {
//       const highLight = () => {
//         if (highlightedCells) {
//           const result = highlightedCells.some(highlightedCell => {
//             return (
//               Number(highlightedCell.xCoordinate) === Number(rowIndex) &&
//               Number(highlightedCell.yCoordinate) === Number(position)
//             );
//           });

//           return result;
//         }
//       };
//       return (
//         <Cell
//           handleHoverToSetShip={handleHoverToSetShip}
//           key={position}
//           xCoordinate={rowIndex}
//           highlighted={highLight()}
//           handleSetShipPosition={handleSetShipPosition}
//           yCoordinate={position}
//         />
//       );
//     }
//   );

//   return <StyledDiv>{renderRow}</StyledDiv>;
// };
const mapStateToProps = state => {
  return {
    ships: state.boardReducer.ships,
    stage: state.gameReducer.stage,
    highlightedCells: state.boardReducer.highlightedCells,
    positionedShip: state.boardReducer.positionedShip
  };
};

export default connect(mapStateToProps)(Row);
