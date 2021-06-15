import { SKILLS } from '../types';

export default function skillsReducer(state = {}, action) {
  switch (action.type) {
    case SKILLS: {
      const { id } = action.payload;
      return { ...state, [id]: action.payload.value };
    }
    default:
      return state;
  }
}
