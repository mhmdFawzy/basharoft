import { COUNTJOB } from '../types';
export function countJob(payload) {
  return { type: COUNTJOB, payload };
}
