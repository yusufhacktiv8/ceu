import React from 'react';
import { Layout } from 'antd';
import PengampuList from './PengampuList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt; </span><span className="page-header-title"> Pengampu</span>
    </Header>
    <Content className="page-content">
      <PengampuList />
    </Content>
  </Layout>
);
