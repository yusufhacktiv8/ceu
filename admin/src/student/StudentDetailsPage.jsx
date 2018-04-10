import React from 'react';
import { Layout } from 'antd';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Students &gt;</span><span className="page-header-title"> Details</span>
    </Header>
    <Content className="page-content">
    </Content>
  </Layout>
);
