import React from 'react';
import { Layout } from 'antd';
import DocentList from './DocentList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt; </span><span className="page-header-title"> Docents</span>
    </Header>
    <Content className="page-content">
      <DocentList />
    </Content>
  </Layout>
);
