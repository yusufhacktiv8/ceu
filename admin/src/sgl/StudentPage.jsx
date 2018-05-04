import React from 'react';
import { Layout } from 'antd';
import StudentList from './StudentList';

const { Header, Content } = Layout;

export default ({ history }) => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span className="page-header-title">Students</span>
    </Header>
    <Content className="page-content">
      <StudentList history={history} />
    </Content>
  </Layout>
);
