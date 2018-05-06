import React from 'react';
import { Layout } from 'antd';
import AssistanceList from './AssistanceList';

const { Header, Content } = Layout;

export default ({ history }) => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span className="page-header-title"> Assistances</span>
    </Header>
    <Content className="page-content">
      <AssistanceList history={history} />
    </Content>
  </Layout>
);
