import * as types from '../../constants/actionTypes';

const initialState = {
  playerName: 'sa',
  stage: 'starting',
  userTurn: true,
  winner: ''
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
        winner: action.payload.winner,
        usertTurn: true
      };

    case types.SURRENDER:
      return {
        ...state,
        winner: 'cpu'
      };
    default:
      return state;
  }
};

export default gameReducer;
