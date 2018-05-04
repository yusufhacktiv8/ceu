import React from 'react';
import { Layout } from 'antd';
import CourseList from './CourseList';

const { Header, Content } = Layout;

export default ({ match, history }) => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Students &gt;</span><span className="page-header-title"> Courses</span>
    </Header>
    <Content className="page-content">
      <CourseList match={match} history={history} />
    </Content>
  </Layout>
);
