import React from 'react';
import { Layout } from 'antd';
import MidKompreSchedule from './MidKompreSchedule';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Report &gt;</span><span className="page-header-title"> Mid Kompre Schedule</span>
    </Header>
    <Content className="page-content">
      <MidKompreSchedule />
    </Content>
  </Layout>
);
