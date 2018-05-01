import React from 'react';
import { Layout } from 'antd';
import AssistanceList from './AssistanceList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Process &gt;</span><span className="page-header-title"> Assistance</span>
    </Header>
    <Content className="page-content">
      <AssistanceList />
    </Content>
  </Layout>
);
