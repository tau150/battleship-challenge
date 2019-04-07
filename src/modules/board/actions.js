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

export const rotateShip = (ship, direction) => {
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

export const highlightPossibleSelection = cells => {
  return {
    type: types.HIGHLIGHT_POSSIBLE_SELECTION,
    payload: {
      cells
    }
  };
};

export const setShipPosition = (ships, selectedShip, positions) => {
  console.log(ships, selectedShip, positions);
  const shipss = ships;

  const newShips = ships.map(ship => {
    if (ship.id === selectShip.id) {
    }

    return ship;
  });
  return {
    type: 'Ad'
  };
};
