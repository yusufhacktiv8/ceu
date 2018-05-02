import React from 'react';
import { Route } from 'react-router-dom';
import 'antd/dist/antd.css';

import './App.css';
import Workspace from './workspace/Workspace';
import WorkspaceBakordik from './workspace/WorkspaceBakordik';
import LoginForm from './login/LoginForm';

const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

const App = () => {
  const token = window.sessionStorage.getItem('token');
  if (token) {
    const { role } = parseJwt(token);
    if (role === 'ADMIN') {
      return (
        <div className="App">
          <Route path="/" component={Workspace} />
        </div>
      );
    } else if (role === 'BAKORDIK') {
      return (
        <div className="App">
          <Route path="/" component={WorkspaceBakordik} />
        </div>
      );
    }
  }

  return (
    <div className="App">
      <LoginForm />
    </div>
  );
};

export default App;
