import React from 'react';
import { Layout } from 'antd';
import SupervisorList from './SupervisorList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt;</span><span className="page-header-title"> Supervisors</span>
    </Header>
    <Content className="page-content">
      <SupervisorList />
    </Content>
  </Layout>
);
