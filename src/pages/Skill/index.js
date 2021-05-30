import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router';
// import PropTypes from "prop-types";
import API from '../../utils/axios';
import { Link } from 'react-router-dom';

import Rect from '../../components/loading/Rect';
import '../Job/job.scss';

const RelatedCard = React.lazy(() => import('../../components/RelatedCard'));

function Skill() {
  const { id } = useParams();
  const [error, setError] = useState('');
  const [isloading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [skillDescription, setSkillDescription] = useState('');
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [relatedSkills, setRelatedSkills] = useState([]);

  useEffect(() => {
    try {
      setLoading(true);
      API.get(`skills/${id}`)
        .then(res => {
          setJobTitle(res.data.skill_name);
          setSkillDescription(res.data.description);
        })
        .catch(() => {
          setLoading(false);
          setError("Can't find this job");
        });
      API.get(`skills/${id}/related_jobs`)
        .then(res => {
          setRelatedJobs(res.data.jobs.slice(0, 5));
        })
        .catch(() => {
          setLoading(false);
          setRelatedJobs([]);
        });
      API.get(`skills/${id}/related_skills`)
        .then(res => {
          setRelatedSkills(res.data.skills.slice(0, 12));
        })
        .catch(() => {
          setLoading(false);
          setRelatedSkills([]);
        });
    } catch (err) {
      setLoading(false);
      setError('Something went wrong');
    }
  }, [id]);
  return (
    <div>
      <div className="container">
        <h1 className="container__headline">{jobTitle || error}</h1>

        <div className="container__grid">
          <div className="job__relatedskills">
            <h3>Description:</h3>
            <p> {skillDescription}</p> <h3>Related Jobs:</h3>
            {relatedJobs.length >= 1 ? (
              relatedJobs.map(job => (
                <Suspense fallback={<Rect />} key={job.job_uuid}>
                  <RelatedCard skill={job} />
                </Suspense>
              ))
            ) : isloading ? (
              <Rect />
            ) : (
              <p>can not get related skills</p>
            )}
          </div>
          <div className="related">
            <h3>Related Skills:</h3>
            <ul>
              {relatedSkills.length >= 1 ? (
                relatedSkills.map((skill, i) => (
                  <li key={i}>
                    <Link
                      to={{
                        pathname: `/skill/${skill.uuid}`,
                      }}>
                      {skill.skill_name}
                    </Link>
                  </li>
                ))
              ) : (
                <li>Can not find related jobs</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Home.propTypes = {};

export default Skill;
