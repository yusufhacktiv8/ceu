import React from 'react';
import { Layout } from 'antd';
import SeminarTypeList from './SeminarTypeList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt;</span><span className="page-header-title"> Seminar Types</span>
    </Header>
    <Content className="page-content">
      <SeminarTypeList />
    </Content>
  </Layout>
);
