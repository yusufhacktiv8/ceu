import React from 'react';
import { Layout } from 'antd';
import SeminarList from './SeminarList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span className="page-header-title"> Seminars</span>
    </Header>
    <Content className="page-content">
      <SeminarList />
    </Content>
  </Layout>
);
