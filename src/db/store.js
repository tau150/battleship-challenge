import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import gameReducer from '../modules/game/reducers';
import boardReducer from '../modules/board/reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
  gameReducer,
  boardReducer
});

export default createStore(reducers, composeEnhancers(applyMiddleware(thunk)));
