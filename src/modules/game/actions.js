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
  return {
    type: types.START_BATTLE
  };
};

export const finishGame = winner => {
  return {
    type: types.FINISH_GAME,
    payload: {
      winner
    }
  };
};

export const changeTurn = () => {
  return {
    type: types.CHANGE_TURN
  };
};

// export const restartGame = () => {
//   return {
//     type: types.RESTART_GAME
//   };
// };
