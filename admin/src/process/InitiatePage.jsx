import React from 'react';
import { Layout } from 'antd';
import InitiateList from './InitiateList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Process &gt;</span><span className="page-header-title"> Initiate</span>
    </Header>
    <Content className="page-content">
      <InitiateList />
    </Content>
  </Layout>
);
