import { combineReducers } from 'redux';
import jobs from './jobs';
import jobsCount from './jobsCount';
import skills from './skills';

const rootReducer = combineReducers({ jobs, jobsCount, skills });

export default rootReducer;
