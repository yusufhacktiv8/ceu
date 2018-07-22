import React from 'react';
import { Layout } from 'antd';
import YudisiumSchedule from './YudisiumSchedule';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Report &gt;</span><span className="page-header-title"> Yudisium Schedule</span>
    </Header>
    <Content className="page-content">
      <YudisiumSchedule />
    </Content>
  </Layout>
);
