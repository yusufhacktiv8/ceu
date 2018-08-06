import React from 'react';
import { Layout } from 'antd';
import AssistanceTopicList from './AssistanceTopicList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt;</span><span className="page-header-title"> Assistance Topics</span>
    </Header>
    <Content className="page-content">
      <AssistanceTopicList />
    </Content>
  </Layout>
);
