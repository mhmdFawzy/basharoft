import React, { Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './jobcard.scss';
import API from '../../utils/axios';
import { editJob } from '../../redux/actions/jobs';
import Rect from '../loading/Rect';
const SkillTag = React.lazy(() => import('../SkillTag'));

function JobCard({ job, innerRef }) {
  const dispatch = useDispatch();
  const [relatedSkills, setRelatedSkills] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    if (job.skills?.length === 6) {
      return;
    } else {
      try {
        API.get(`jobs/${job.uuid}/related_skills`)
          .then(res => {
            res.data.skills.slice(0, 6).forEach(skill => {
              setRelatedSkills(prevState => {
                return [
                  ...prevState,
                  { skill_name: skill.skill_name, skill_uuid: skill.skill_uuid },
                ];
              });
            });
          })
          .catch(() => {
            setError('No associated skills found for job ');
          });
      } catch {
        setError('No associated skills found for job ');
      }
    }
  }, [job.skills?.length, job.uuid]);
  useEffect(() => {
    return () => {
      if (relatedSkills.length === 6 && job.title)
        dispatch(editJob({ id: job.uuid, skills: relatedSkills }));
    };
  }, [dispatch, job.title, job.uuid, relatedSkills]);
  return (
    <div className="jobcardWrapper" ref={innerRef}>
      <div className="jobcard__content">
        <h3>{job.title || job.suggestion}</h3>
        <div className="skillsWrapper">
          <span>Related Skills:</span>
          <div className="skills">
            {job?.skills?.length === 6
              ? job?.skills.map(skill => (
                  <Suspense fallback={<div>Loading...</div>} key={skill.skill_uuid}>
                    <SkillTag id={skill.skill_uuid} name={skill.skill_name} />
                  </Suspense>
                ))
              : relatedSkills.length === 6
              ? relatedSkills.map(skill => (
                  <Suspense fallback={<div>Loading...</div>} key={skill.skill_uuid}>
                    <SkillTag id={skill.skill_uuid} name={skill.skill_name} />
                  </Suspense>
                ))
              : error !== ''
              ? error
              : Array.from({ length: 6 }).map((item, i) => <Rect key={i} />)}
          </div>
          <div className="jobcard__details">
            <Link to={`/job/${job.uuid}`}>View Job details</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

JobCard.propTypes = {
  job: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    suggestion: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    normalized_job_title: PropTypes.string.isRequired,
    parent_uuid: PropTypes.string.isRequired,
    skills: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)),
  }).isRequired,
  innerRef: PropTypes.func,
};

export default React.memo(React.forwardRef(JobCard));
