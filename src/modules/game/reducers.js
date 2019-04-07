import * as types from '../../constants/actionTypes';

const initialState = {
  playerName: null,
  stage: 'starting'
};

const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.START_GAME:
      return {
        ...state,
        playerName: action.payload.playerName,
        stage: 'placingShips'
      };

    default:
      return state;
  }
};

export default gameReducer;
