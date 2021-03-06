import React, { useEffect, useState, Suspense } from 'react';
import { useParams } from 'react-router';
import API from '../../utils/axios';
import Rect from '../../components/loading/Rect';
import RelatedLinks from '../../components/RelatedLinks';
import './job.scss';

const RelatedCard = React.lazy(() => import('../../components/RelatedCard'));

function Job() {
  const { id } = useParams();
  const [error, setError] = useState('');
  const [isloading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [relatedJobs, setRelatedJobs] = useState([]);
  const [relatedSkills, setRelatedSkills] = useState([]);

  useEffect(() => {
    try {
      setLoading(true);
      API.get(`jobs/${id}`)
        .then(res => {
          setJobTitle(res.data.title);
        })
        .catch(() => {
          setLoading(false);
          setError("Can't find this job");
        });
      API.get(`jobs/${id}/related_jobs`)
        .then(res => {
          setRelatedJobs(res.data.related_job_titles.slice(0, 12));
        })
        .catch(() => {
          setLoading(false);
          setRelatedJobs([]);
        });
      API.get(`jobs/${id}/related_skills`)
        .then(res => {
          setRelatedSkills(res.data.skills.slice(0, 5));
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
            <h3>Related Skills:</h3>
            {relatedSkills.length >= 1 ? (
              relatedSkills.map(skill => (
                <Suspense fallback={<Rect />} key={skill.skill_uuid}>
                  <RelatedCard skill={skill} />
                </Suspense>
              ))
            ) : isloading ? (
              <Rect />
            ) : (
              <p>can not get related jobs</p>
            )}
          </div>
          <div className="related">
            <h3>Related Jobs:</h3>
            <RelatedLinks relatedLinks={relatedJobs} type={'jobs'} path={'job'} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Job;
