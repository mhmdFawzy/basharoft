import { SKILLS } from '../types';

export default function skillsReducer(state = {}, action) {
  switch (action.type) {
    case SKILLS: {
      return action.payload;
    }
    // omit other cases
    default:
      return state;
  }
}
