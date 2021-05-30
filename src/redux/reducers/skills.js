import { SKILLS } from '../types';

export default function skillsReducer(state = {}, action) {
  switch (action.type) {
    case SKILLS: {
      return action.payload;
    }
    default:
      return state;
  }
}
