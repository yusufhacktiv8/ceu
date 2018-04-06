import React from 'react';
import { Layout } from 'antd';
import RoleList from './RoleList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Roles</span>
    </Header>
    <Content className="page-content">
      <RoleList />
    </Content>
  </Layout>
);
