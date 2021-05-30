import { JOBS, EDITJOB, ADDJOB } from '../types';

export function setJobs(payload) {
  return { type: JOBS, payload };
}

export function editJob(payload) {
  return { type: EDITJOB, payload };
}
export function addJobs(payload) {
  return { type: ADDJOB, payload };
}
