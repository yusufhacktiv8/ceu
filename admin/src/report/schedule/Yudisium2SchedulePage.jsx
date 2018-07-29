import React from 'react';
import { Layout } from 'antd';
import Yudisium2Schedule from './Yudisium2Schedule';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Report &gt;</span><span className="page-header-title"> Yudisium 2 Schedule</span>
    </Header>
    <Content className="page-content">
      <Yudisium2Schedule />
    </Content>
  </Layout>
);
