import React from 'react';
import { Layout } from 'antd';
import PreTestList from './PreTestList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Report &gt;</span><span className="page-header-title"> Pre Test</span>
    </Header>
    <Content className="page-content">
      <PreTestList />
    </Content>
  </Layout>
);
