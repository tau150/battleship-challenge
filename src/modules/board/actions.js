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
  const newShips = ships.map(ship => {
    if (ship.id === selectShip.id) {
      ship.positions = positions;
    }

    return ship;
  });
  return {
    type: 'Ad'
  };
};
