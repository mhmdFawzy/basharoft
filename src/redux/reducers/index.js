import { combineReducers } from 'redux';
import jobs from './jobs';
import skills from './skills';

const rootReducer = combineReducers({ jobs, skills });

export default rootReducer;
