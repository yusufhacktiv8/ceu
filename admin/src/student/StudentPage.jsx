import React from 'react';
import { Layout } from 'antd';
import StudentList from './StudentList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span><span className="page-header-title">Student</span></span>
    </Header>
    <Content className="page-content">
      <StudentList />
    </Content>
  </Layout>
);
