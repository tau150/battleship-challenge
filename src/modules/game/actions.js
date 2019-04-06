import * as types from '../../constants/actionTypes';

const initialState = {
    newGame= true
  }
};

export default {
  gameReducer: (state = initialState, action) => {
    switch (action.type) {
      case types.START_GAME:
        return { ...state, newGame: false };

      default:
        return state;
    }
  }
};