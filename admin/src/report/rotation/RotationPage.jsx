import React from 'react';
import { Layout } from 'antd';
import RotationList from './RotationList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Reports &gt;</span><span className="page-header-title"> Rotations</span>
    </Header>
    <Content className="page-content">
      <RotationList />
    </Content>
  </Layout>
);
