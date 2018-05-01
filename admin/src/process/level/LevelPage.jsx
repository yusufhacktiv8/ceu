import React from 'react';
import { Layout } from 'antd';
import LevelList from './LevelList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Process &gt;</span><span className="page-header-title"> Pre Yudisium</span>
    </Header>
    <Content className="page-content">
      <LevelList />
    </Content>
  </Layout>
);
