import { EDITJOB, ADDJOB, COUNTJOB } from '../types';

export function editJob(payload) {
  return { type: EDITJOB, payload };
}
export function addJobs(payload) {
  return { type: ADDJOB, payload };
}
export function countJob(payload) {
  return { type: COUNTJOB, payload };
}
