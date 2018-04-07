import React from 'react';
import { Route } from 'react-router-dom';
import 'antd/dist/antd.css';

import './App.css';
import Workspace from './workspace/Workspace';
import LoginForm from './login/LoginForm';


const App = () => {
  const token = window.sessionStorage.getItem('token');
  if (token) {
    return (
      <div className="App">
        <Route path="/" component={Workspace} />
      </div>
    );
  }

  return (
    <div className="App">
      <LoginForm />
    </div>
  );
};

export default App;
