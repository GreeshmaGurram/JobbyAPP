import {Switch, Route, Redirect} from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute/index'
import LoginForm from './components/LoginForm'
import Home from './components/Home/index'
import Jobs from './components/Jobs'
import NotFound from './components/Not Found'
import JobDetails from './components/JobDetails/index'

import './App.css'

const App = () => (
  <Switch>
    <Route exact path="/login" component={LoginForm} />
    <ProtectedRoute exact path="/" component={Home} />
    <ProtectedRoute exact path="/jobs" component={Jobs} />
    <ProtectedRoute exact path="/jobs/:id" component={JobDetails} />
    <Route component={NotFound} />
    <Redirect to="/not-found" />
  </Switch>
)

export default App
