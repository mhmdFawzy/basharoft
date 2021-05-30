import React, { Suspense, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useLocalStorage from '../../utils/useLocalStorage';
import API from '../../utils/axios';
import SearchInput from '../../components/SearchInput';
import Rect from '../../components/loading/Rect';
const JobCard = React.lazy(() => import('../../components/JobCard'));

function Search() {
  let location = useLocation();
  const jobs = useSelector(state => state.jobs);
  const [error, setError] = useState('');
  const [options, setOptions] = useState({});
  const [isloading, setLoading] = useState(false);
  const [jobsNumber, setjobsNumber] = useState(0);
  const [storedHistory, setHistory] = useLocalStorage('history', []);

  useEffect(() => {
    setOptions({});
    setjobsNumber(0);
    setLoading(true);
    if (location.state?.searchVal) {
      if (storedHistory.indexOf(location.state?.searchVal) >= 0) {
        return;
      }
      if (storedHistory.length === 12) {
        storedHistory.shift();
      }
      setHistory([...storedHistory, location.state.searchVal]);
    }
  }, [location.state?.searchVal]);

  useEffect(() => {
    if (location.state?.searchVal) {
      try {
        API.get(`jobs/autocomplete?contains=${location.state.searchVal}`)
          .then(res => {
            setjobsNumber(res.data.length);
            const normalizedJobs = {};
            res.data.slice(0, 12).forEach(relatedJob => {
              const modifiedJobs = { ...relatedJob };
              normalizedJobs[relatedJob.uuid] = modifiedJobs;
            });

            setOptions(normalizedJobs);
            setLoading(false);
            setError('');
          })
          .catch(() => {
            setLoading(false);
            setOptions({});
            setjobsNumber(0);
            setError('No job title suggestions found');
          });
      } catch (err) {
        setError('Something went wrong');
      }
    }
  }, [jobs, location.state?.searchVal]);
  return (
    <div>
      <SearchInput />
      <main className="container">
        {location.state?.searchVal ? (
          <h1 className="container__headline">
            {`"${location.state.searchVal}" jobs (${jobsNumber})`}
          </h1>
        ) : (
          <h1 className="container__headline">Start searching for jobs</h1>
        )}
        <div className="container__grid">
          <div>
            {location.state?.searchVal && (
              <div className="jobsWrapper">
                {Object.keys(options).length >= 1 &&
                  Object.keys(options).map(uuid => {
                    return (
                      <Suspense fallback={<div>Loading...</div>} key={uuid}>
                        <JobCard job={options[uuid]} />
                      </Suspense>
                    );
                  })}
                {isloading && Array.from({ length: 12 }).map((item, i) => <Rect key={i} />)}
                {error && error}
              </div>
            )}
          </div>
          <div className="related">
            <h3>Search history:</h3>
            <ul>
              {storedHistory.length >= 1 ? (
                storedHistory.map((history, i) => (
                  <li key={i}>
                    <Link
                      to={{
                        pathname: '/search',
                        state: { searchVal: history },
                      }}>
                      {history}
                    </Link>
                  </li>
                ))
              ) : (
                <li>Your history is empty</li>
              )}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Search;
