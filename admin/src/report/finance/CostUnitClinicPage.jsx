import React from 'react';
import { Layout } from 'antd';
import CostUnitClinicList from './CostUnitClinicList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Reports &gt;</span><span className="page-header-title"> Cost Unit Clinic</span>
    </Header>
    <Content className="page-content">
      <CostUnitClinicList />
    </Content>
  </Layout>
);
