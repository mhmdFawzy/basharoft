import { SKILLS } from '../types';

export default function skillsReducer(state = {}, action) {
  switch (action.type) {
    case SKILLS: {
      return { ...state, [action.payload.id]: action.payload.value };
    }
    default:
      return state;
  }
}
