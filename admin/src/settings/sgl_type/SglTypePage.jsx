import React from 'react';
import { Layout } from 'antd';
import SglTypeList from './SglTypeList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt;</span><span className="page-header-title"> Sgl Types</span>
    </Header>
    <Content className="page-content">
      <SglTypeList />
    </Content>
  </Layout>
);
