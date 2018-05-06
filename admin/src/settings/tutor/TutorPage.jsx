import React from 'react';
import { Layout } from 'antd';
import TutorList from './TutorList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt;</span><span className="page-header-title"> Tutors</span>
    </Header>
    <Content className="page-content">
      <TutorList />
    </Content>
  </Layout>
);
