import * as types from '../../constants/actionTypes';

export const startGame = playerName => {
  return {
    type: types.START_GAME,
    payload: {
      playerName
    }
  };
};

export const startBattle = () => {
  console.log('action');
  return {
    type: types.START_BATTLE
  };
};

export const restartGame = () => {
  return {
    type: types.RESTART_GAME
  };
};
