import React from 'react';
import { Layout } from 'antd';
import YudisiumCandidateList from './YudisiumCandidateList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Report &gt;</span><span className="page-header-title"> Yudisium Candidate</span>
    </Header>
    <Content className="page-content">
      <YudisiumCandidateList />
    </Content>
  </Layout>
);
