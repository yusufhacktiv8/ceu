import React from 'react';
import { Layout } from 'antd';
import CompletedList from './CompletedList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Process &gt;</span><span className="page-header-title"> Completed</span>
    </Header>
    <Content className="page-content">
      <CompletedList />
    </Content>
  </Layout>
);
