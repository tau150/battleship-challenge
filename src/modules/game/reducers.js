import * as types from '../../constants/actionTypes';

const initialState = {
  playerName: null,
  stage: 'starting',
  userTurn: true
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

    default:
      return state;
  }
};

export default gameReducer;
