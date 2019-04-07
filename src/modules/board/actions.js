import _ from 'lodash';
import * as types from '../../constants/actionTypes';

export const initShips = () => {
  return {
    type: types.INIT_SHIPS
  };
};

export const selectShip = ship => {
  return {
    type: types.SELECT_SHIP,
    payload: {
      ship
    }
  };
};

export const rotateShip = ship => {
  const newShip = ship;

  if (ship.direction === 'horizontal') {
    newShip.direction = 'vertical';
  } else {
    newShip.direction = 'horizontal';
  }

  return {
    type: types.SELECT_SHIP,
    payload: {
      ship: newShip
    }
  };
};

export const highlightPossibleSelection = (cellsToHighlight, cells) => {
  const cellsToFill = cellsToHighlight;
  const idsToChange = [];

  cellsToFill.map(cell => {
    const cellToChange = _.find(
      cells,
      c =>
        c.xCoordinate === cell.xCoordinate && c.yCoordinate === cell.yCoordinate
    );
    idsToChange.push(cellToChange.id);
  });

  const finalCells = cells;

  const result = finalCells.map(cell => {
    const c = cell;

    if (idsToChange.indexOf(c.id) >= 0) {
      c.highlighted = true;
    } else {
      c.highlighted = false;
    }

    return c;
  });

  return {
    type: types.HIGHLIGHT_POSSIBLE_SELECTION,
    payload: {
      cells: result,
      highlightedCells: idsToChange
    }
  };
};

export const setShipPosition = (ships, selectedShip, positions, cells) => {
  const allShips = ships;
  const shipToTransform = selectedShip;
  shipToTransform.position = positions;
  allShips.map(ship => {
    const iterableShip = ship;
    if (ship.id === shipToTransform.id) {
      iterableShip.position = positions;
    }
    return iterableShip;
  });

  const allCells = cells;

  allCells.map(cell => {
    const c = cell;

    if (positions.indexOf(c.id) >= 0) {
      c.isAvailable = false;
      c.type = selectedShip.type;
    }
    return c;
  });

  return {
    type: types.SET_SHIP_POSITION,
    payload: {
      ships: allShips,
      positionedShip: shipToTransform,
      cells: allCells
    }
  };
};

// export const setShipPosition = (ships, selectedShip, positions) => {
//   const allShips = ships;
//   const shipToTransform = selectedShip;
//   shipToTransform.position = positions;
//   allShips.map(ship => {
//     const iterableShip = ship;
//     if (ship.id === shipToTransform.id) {
//       iterableShip.position = positions;
//     }
//     return iterableShip;
//   });

//   return {
//     type: types.SET_SHIP_POSITION,
//     payload: {
//       ships: allShips,
//       positionedShip: shipToTransform
//     }
//   };
// };
