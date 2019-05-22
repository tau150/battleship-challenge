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
      hits: [],
      condition: 'new',
      direction: 'horizontal'
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: [],
      condition: 'new',
      direction: 'horizontal'
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: [],
      condition: 'new',
      direction: 'horizontal'
    },
    {
      type: 'Cruisers',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: [],
      condition: 'new',
      direction: 'horizontal'
    },
    {
      type: 'Submarine',
      id: Math.random()
        .toString(36)
        .substr(2, 9),
      position: null,
      hits: [],
      condition: 'new',
      direction: 'horizontal'
    }
  ],
  cells,
  selectedShip: null,
  highlightedCells: null,
  positionedShip: null,
  cpuCells: initialization.cells,
  cpuShips: initialization.ships,
  userDestroyedShips: 0,
  cpuDestroyedShips: 0,
  latestCpuImpacts: [],
  latestDirections: [],
  strategy: 'random',
  possibleDirections: null,
  lastDirection: null,
  target: null,
  possibleDirectionsForTarget: null,
  requireTargetReconfig: false,
  usedTargets: []
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

    case types.USER_ATTACK_SHIP:
      return {
        ...state,
        cpuShips: action.payload.cpuShips,
        cpuCells: action.payload.cpuCells,
        cpuDestroyedShips:
          state.cpuDestroyedShips + action.payload.destroyedShips,
        userTurn: false
      };

    case types.CPU_ATTACK_SHIP:
      return {
        ...state,
        ships: action.payload.userShips,
        cells: action.payload.userCells,
        latestCpuImpacts: [
          ...state.latestCpuImpacts,
          action.payload.attackedCell
        ],
        userDestroyedShips:
          state.userDestroyedShips + action.payload.destroyedShips,
        lastDirection: action.payload.lastDirection,
        latestDirections: [
          ...state.latestDirections,
          action.payload.lastDirection
        ],
        possibleDirectionsForTarget: action.payload.possibleDirectionsForTarget,
        requireTargetReconfig: action.payload.requireTargetReconfig,
        resetTarget: action.payload.resetTarget
      };

    case types.CHANGE_STRATEGY:
      return {
        ...state,
        strategy: action.payload.strategy,
        target: action.payload.target,
        requireTargetReconfig: action.payload.requireTargetReconfig
      };

    default:
      return state;
  }
};

export default boardReducer;
