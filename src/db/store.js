import { createStore, combineReducers } from 'redux';
import gameReducer from '../modules/game/reducers';
import boardReducer from '../modules/board/reducers';

const reducers = combineReducers({
  gameReducer,
  boardReducer
});

export default createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
