import React from 'react';
import { Layout } from 'antd';
import InitiateList from './InitiateList';

const { Header, Content } = Layout;

export default ({ history }) => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span className="page-header-title">Courses</span>
    </Header>
    <Content className="page-content">
      <InitiateList history={history} />
    </Content>
  </Layout>
);
