import React, { Suspense, useCallback, useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Rect from '../../components/loading/Rect';
import SearchInput from '../../components/SearchInput';
import API from '../../utils/axios';
// import PropTypes from 'prop-types';
import './home.scss';
import { addJobs } from '../../redux/actions/jobs';
const JobCard = React.lazy(() => import('../../components/JobCard'));
import { setJobs } from '../../redux/actions/jobs';

function Home() {
  const dispatch = useDispatch();
  const [loadingMore, setLoadingMore] = useState(false);
  const jobs = useSelector(state => state.jobs);
  const observer = useRef();
  const [isloading, setIsloading] = useState(true);
  const [error, setError] = useState('');
  const normalizedJobs = {};
  const [jobsNumber, setjobsNumber] = useState(0);
  const getLastLink = links => {
    const linkObj = links.filter(link => {
      return link.rel === 'last';
    });
    let match = linkObj[0].href.match('[?&]' + 'offset' + '=([^&]+)');
    return match[1];
  };
  const lastCrad = useCallback(
    node => {
      if (isloading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setLoadingMore(true);
          if (Object.keys(jobs).length === jobsNumber) {
            return;
          }
          if (Object.keys(jobs).length > 1) {
            const normalizedJobs = {};
            API.get(`jobs?offset=${Object.keys(jobs).length}&limit=12`).then(res => {
              res.data.slice(0, 12).forEach(job => {
                const modifiedJobs = { ...job };
                normalizedJobs[job.uuid] = modifiedJobs;
              });
              dispatch(addJobs(normalizedJobs));
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
    console.log(jobs);
    if (Object.keys(jobs).length >= 1) {
      return;
    }
    setIsloading(true);
    try {
      API.get('jobs?limit=12')
        .then(res => {
          const lastLink = getLastLink(res.data[res.data.length - 1].links);
          setjobsNumber(lastLink);
          res.data.slice(0, 12).forEach(job => {
            const modifiedJobs = { ...job };
            normalizedJobs[job.uuid] = modifiedJobs;
          });
          setIsloading(false);
          dispatch(setJobs(normalizedJobs));
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
  // useEffect(() => {
  //   setIsloading(true);
  //   try {
  //     API.get('skills?limit=499')
  //       .then(res => {
  //         res.data.forEach(skill => {
  //           const modifiedJobs = { ...skill };
  //           normalizedSkills[skill.uuid] = modifiedJobs;
  //         });
  //         setIsloading(false);
  //         dispatch(setSkills(normalizedSkills));
  //       })
  //       .catch(() => {
  //         setError('Something went wrong with skills');
  //         setIsloading(false);
  //       });
  //   } catch (err) {
  //     setIsloading(false);
  //     setError('Something went wrong with skills');
  //   }
  // }, []);
  return (
    <div>
      <SearchInput />
      <main className="container">
        <h1 className="container__headline">All Jobs ({jobsNumber >= 1 && jobsNumber})</h1>
        <div className="jobsWrapper">
          {Object.keys(jobs).length >= 1 &&
            Object.keys(jobs).map((uuid, i) => {
              if (Object.keys(jobs).length - 2 === i) {
                return (
                  <Suspense fallback={<Rect />} key={uuid}>
                    <JobCard job={jobs[uuid]} ref={lastCrad} />
                  </Suspense>
                );
              } else {
                return (
                  <Suspense fallback={<Rect />} key={uuid}>
                    <JobCard job={jobs[uuid]} />
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
