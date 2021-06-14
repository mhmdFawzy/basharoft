import React, { Suspense, useCallback, useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Rect from '../../components/loading/Rect';
import SearchInput from '../../components/SearchInput';
import API from '../../utils/axios';
import './home.scss';
import { addJobs, countJob } from '../../redux/actions/jobs';
import { getJobsCountfromLinks } from '../../utils/getJobsCount';
const JobCard = React.lazy(() => import('../../components/JobCard'));

function Home() {
  const dispatch = useDispatch();
  const [loadingMore, setLoadingMore] = useState(false);
  const jobs = useSelector(state => state.jobs);
  const jobsCount = useSelector(state => state.jobsCount);
  const observer = useRef();
  const [isloading, setIsloading] = useState(false);
  const [error, setError] = useState('');
  const normalizedJobs = {};
  const lastCrad = useCallback(
    node => {
      if (isloading || loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setLoadingMore(true);
          if (Object.keys(jobs).length > 1) {
            const normalizedJobs = {};
            API.get(`jobs?offset=${Object.keys(jobs).length}&limit=12`).then(res => {
              res.data.slice(0, 12).forEach(job => {
                const modifiedJobs = { ...job };
                normalizedJobs[job.uuid] = modifiedJobs;
              });
              dispatch(addJobs(normalizedJobs));
              setLoadingMore(false);
            });
          }
        } else {
          setLoadingMore(false);
        }
      });
      if (node) {
        observer.current.observe(node);
      }
    },
    [isloading, jobs]
  );
  useEffect(() => {
    if (Object.keys(jobs).length >= 12) {
      return;
    }
    setIsloading(true);
    try {
      API.get(`jobs?offset=${Object.keys(jobs).length}&limit=12`)
        .then(res => {
          const jobsFromLinks = getJobsCountfromLinks(res.data[res.data.length - 1].links);
          dispatch(countJob(jobsFromLinks));
          res.data.slice(0, 12).forEach(job => {
            const modifiedJobs = { ...job };
            normalizedJobs[job.uuid] = modifiedJobs;
          });
          setIsloading(false);
          dispatch(addJobs(normalizedJobs));
        })
        .catch(() => {
          setError('Something went wrong with jobs');
          setIsloading(false);
        });
    } catch (err) {
      setIsloading(false);
      setError('Something went wrong with jobs');
    }
  }, []);

  return (
    <div>
      <SearchInput />
      <main className="container">
        <h1 className="container__headline">All Jobs ({jobsCount >= 1 && jobsCount})</h1>
        <div className="jobsWrapper">
          {Object.keys(jobs).length >= 1 &&
            Object.keys(jobs).map((uuid, i) => {
              if (Object.keys(jobs).length - 1 === i) {
                return (
                  <Suspense fallback={<Rect />} key={uuid}>
                    <JobCard job={jobs[uuid]} ref={lastCrad} search={false} />
                  </Suspense>
                );
              } else {
                return (
                  <Suspense fallback={<Rect />} key={uuid}>
                    <JobCard job={jobs[uuid]} search={false} />
                  </Suspense>
                );
              }
            })}
          {(isloading || loadingMore) &&
            Array.from({ length: 12 }).map((item, i) => <Rect key={i} />)}
          {error && error}
        </div>
      </main>
    </div>
  );
}

// Home.propTypes = {
//   { isloading, error, jobsNumber }
//   isloading: PropTypes.bool.isRequired,
//   error: PropTypes.string.isRequired,
//   jobsNumber: PropTypes.number.isRequired,
// };

export default Home;
