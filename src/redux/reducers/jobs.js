import { EDITJOB, ADDJOB } from '../types';

export default function jobsReducer(state = {}, action) {
  switch (action.type) {
    case EDITJOB: {
      const id = action.payload.id;
      return {
        ...state,
        [id]: {
          ...state[id],
          skills: action.payload.skills,
        },
      };
    }
    case ADDJOB: {
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}
