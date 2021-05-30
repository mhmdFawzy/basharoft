import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkRedux from 'redux-thunk';
import rootReducer from './reducers';

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunkRedux)));

export default store;
