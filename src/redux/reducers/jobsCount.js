import { COUNTJOB } from '../types';

export default function jobsReducer(state = {}, action) {
  switch (action.type) {
    case COUNTJOB:
      return action.payload;

    default:
      return state;
  }
}
