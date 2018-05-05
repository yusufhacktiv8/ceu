import React from 'react';
import { Layout } from 'antd';
import PortofolioTypeList from './PortofolioTypeList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt;</span><span className="page-header-title"> Portofolio Types</span>
    </Header>
    <Content className="page-content">
      <PortofolioTypeList />
    </Content>
  </Layout>
);
