import React from 'react';
import { Layout } from 'antd';
import ScoreList from './ScoreList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Uploads &gt;</span><span className="page-header-title"> Scores</span>
    </Header>
    <Content className="page-content">
      <ScoreList />
    </Content>
  </Layout>
);
