import { JOBS, EDITJOB, ADDJOB } from '../types';

export default function jobsReducer(state = {}, action) {
  switch (action.type) {
    case JOBS: {
      return action.payload;
    }
    case EDITJOB: {
      const id = action.payload.id;
      return {
        ...state,
        [id]: {
          ...state[id],
          skills: action.payload.skills,
          inDom: true,
        },
      };
    }
    case ADDJOB: {
      return { ...state, ...action.payload };
    }
    // omit other cases
    default:
      return state;
  }
}
