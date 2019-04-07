import * as types from '../../constants/actionTypes';

const initialState = {
  ships: [
    {
      type: 'Carrier',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: 'horizontal'
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: 'horizontal'
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: 'horizontal'
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: 'horizontal'
    },
    {
      type: 'Submarine',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: null,
      direction: 'horizontal'
    }
  ],

  selectedShip: null,
  highlightedCells: null
};

const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INIT_SHIPS:
      return { ...state };

    case types.SELECT_SHIP:
      console.log(action.payload.ship);
      return { ...state, selectedShip: action.payload.ship };

    case types.HIGHLIGHT_POSSIBLE_SELECTION:
      return { ...state, highlightedCells: action.payload.cells };

    default:
      return state;
  }
};

export default boardReducer;
