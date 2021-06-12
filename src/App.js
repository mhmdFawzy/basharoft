import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Layout/Header';
import Home from './pages/Home';
import Job from './pages/Job';
import Skill from './pages/Skill';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

// isloading={isloading} error={error} jobsNumber={jobsNumber}

function App() {
  return (
    <Router>
      <div>
        <Header>
          <Switch>
            <Route exact path="/">
              <Home />
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
