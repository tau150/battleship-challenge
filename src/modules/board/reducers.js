import * as types from '../../constants/actionTypes';
import { generateMatrix, initCpu } from '../../utils/helpers';

const cells = generateMatrix();
const initialization = initCpu();

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
  cells,
  selectedShip: null,
  highlightedCells: null,
  positionedShip: null,
  cpuCells: initialization.cells,
  cpuShips: initialization.ships
};

const boardReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.INIT_SHIPS:
      return { ...state };

    case types.SELECT_SHIP:
      return { ...state, selectedShip: action.payload.ship };

    case types.HIGHLIGHT_POSSIBLE_SELECTION:
      return {
        ...state,
        cells: action.payload.cells,
        highlightedCells: action.payload.highlightedCells
      };

    case types.SET_SHIP_POSITION:
      return {
        ...state,
        ships: action.payload.ships,
        selectedShip: null,
        positionedShip: action.payload.positionedShip,
        cells: action.payload.cells
      };

    default:
      return state;
  }
};

export default boardReducer;
