import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Job from './pages/Job';
import Skill from './pages/Skill';
import Search from './pages/Search';
import NotFound from './pages/NotFound';
import { setJobs } from './redux/actions/jobs';
import { setSkills } from './redux/actions/skills';

import API from './utils/axios';

function App() {
  const [isloading, setIsloading] = useState(true);
  const [error, setError] = useState('');
  const [jobsNumber, setjobsNumber] = useState(0);
  const dispatch = useDispatch();
  const normalizedJobs = {};
  const normalizedSkills = {};
  useEffect(() => {
    setIsloading(true);
    try {
      API.get('jobs?limit=499')
        .then(res => {
          setjobsNumber(res.data.length);
          res.data.slice(0, 12).forEach(job => {
            const modifiedJobs = { ...job };
            normalizedJobs[job.uuid] = modifiedJobs;
          });
          setIsloading(false);
          dispatch(setJobs(normalizedJobs));
        })
        .catch(() => {
          setError('Something went wrong with skills');
          setIsloading(false);
        });
    } catch (err) {
      setIsloading(false);
      setError('Something went wrong with jobs');
    }
  }, []);
  useEffect(() => {
    setIsloading(true);
    try {
      API.get('skills?limit=499')
        .then(res => {
          res.data.forEach(skill => {
            const modifiedJobs = { ...skill };
            normalizedSkills[skill.uuid] = modifiedJobs;
          });
          setIsloading(false);
          dispatch(setSkills(normalizedSkills));
        })
        .catch(() => {
          setError('Something went wrong with skills');
          setIsloading(false);
        });
    } catch (err) {
      setIsloading(false);
      setError('Something went wrong with skills');
    }
  }, []);

  return (
    <Router>
      <div>
        <Header>
          <Switch>
            <Route exact path="/">
              <Home isloading={isloading} error={error} jobsNumber={jobsNumber} />
            </Route>
            <Route exact path="/job/:id">
              <Job />
            </Route>
            <Route exact path="/skill/:id">
              <Skill />
            </Route>
            <Route exact path="/search">
              <Search />
            </Route>
            <Route component={NotFound} />
          </Switch>
        </Header>
      </div>
    </Router>
  );
}

export default App;
