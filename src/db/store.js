import { createStore, combineReducers } from 'redux';
import gameReducer from '../modules/game/reducers';
import boardReducer from '../modules/board/reducers';

const reducers = combineReducers({
  gameReducer,
  boardReducer
});

export default createStore(reducers);
