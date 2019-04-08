import * as types from '../../constants/actionTypes';
import generateMatriz from '../../utils/helpers';

// const matriz = () => {
//   const cells = [];

//   for (let i = 0; i <= 9; i += 1) {
//     for (let j = 0; j <= 9; j += 1) {
//       cells.push({
//         xCoordinate: i,
//         yCoordinate: j,
//         isAvailable: true,
//         highlighted: false,
//         type: null,
//         id: Math.random()
//           .toString(36)
//           .substr(2, 9)
//       });
//     }
//   }
//   return cells;
// };

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
  cells: generateMatriz(),
  selectedShip: null,
  highlightedCells: null,
  positionedShip: null,
  cpuShips: null,
  cpuCells: generateMatriz()
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

    // case types.INIT_CPU_BOARD:
    //   return {
    //     ...state,
    //     cpuCells: matriz()
    //   };

    default:
      return state;
  }
};

export default boardReducer;
