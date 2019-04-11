import * as types from '../../constants/actionTypes';

const initialState = {
  playerName: null,
  stage: 'starting',
  userTurn: true,
  winner: null
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.START_GAME:
      return {
        ...state,
        playerName: action.payload.playerName,
        stage: 'placingShips'
      };

    case types.START_BATTLE:
      return {
        ...state,
        stage: 'battle'
      };

    case types.CHANGE_TURN:
      return {
        ...state,
        userTurn: !state.userTurn
      };

    case types.FINISH_GAME:
      return {
        ...state,
        winner: action.payload.winner
      };

    default:
      return state;
  }
};

export default gameReducer;
