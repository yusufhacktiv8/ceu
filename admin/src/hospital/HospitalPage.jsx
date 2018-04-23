import React from 'react';
import { Layout } from 'antd';
import HospitalList from './HospitalList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span className="page-header-title">Hospitals</span>
    </Header>
    <Content className="page-content">
      <HospitalList />
    </Content>
  </Layout>
);
