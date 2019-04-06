import * as types from '../../constants/actionTypes';

export const startGame = playerName => {
  return {
    type: types.START_GAME,
    payload: {
      playerName
    }
  };
};

export const restartGame = () => {
  return {
    type: types.RESTART_GAME
  };
};
