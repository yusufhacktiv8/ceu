import React from 'react';
import { Route } from 'react-router-dom';
import 'antd/dist/antd.css';

import './App.css';
import Workspace from './workspace/Workspace';
import LoginForm from './login/LoginForm';


const App = () => (
  <div className="App">
    <Route path="/" component={Workspace} />
    <Route exact path="/login" component={LoginForm} />
  </div>
);

export default App;
