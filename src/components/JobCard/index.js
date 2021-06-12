import React, { Suspense, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './jobcard.scss';
import API from '../../utils/axios';
import { editJob } from '../../redux/actions/jobs';
import Rect from '../loading/Rect';
const SkillTag = React.lazy(() => import('../SkillTag'));
import { setSkills } from '../../redux/actions/skills';

function JobCard({ job }, ref) {
  const dispatch = useDispatch();
  const reduxSkills = useSelector(state => state.skills);
  const [relatedSkills, setRelatedSkills] = useState({});
  const [error, setError] = useState('');
  useEffect(() => {
    if (job.skills && Object.keys(job.skills).length === 6) {
      return;
    } else {
      try {
        API.get(`jobs/${job.uuid}/related_skills`)
          .then(res => {
            res.data.skills.slice(0, 6).forEach(skill => {
              setRelatedSkills(prevState => {
                return { ...prevState, [skill.skill_uuid]: { ...skill } };
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
  }, [job.uuid]);
  useEffect(() => {
    if (Object.keys(relatedSkills).length === 6) {
      dispatch(editJob({ id: job.uuid, skills: Object.keys(relatedSkills) }));
    }

    Object.keys(relatedSkills).map(skill => {
      if (Object.prototype.hasOwnProperty.call(reduxSkills, skill)) {
        return;
      } else {
        dispatch(setSkills({ id: skill, value: relatedSkills[skill] }));
      }
    });
  }, [relatedSkills]);

  return (
    <div className="jobcardWrapper" ref={ref}>
      <div className="jobcard__content">
        <h3>{job.title || job.suggestion}</h3>
        <div className="skillsWrapper">
          <span>Related Skills:</span>
          <div className="skills">
            {job.skills?.length === 6
              ? job.skills.map(skill => (
                  <Suspense fallback={<Rect />} key={skill}>
                    <SkillTag id={skill} name={reduxSkills[skill].skill_name} />
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
};
JobCard.displayName = 'JobCard';

export default React.forwardRef(JobCard);
