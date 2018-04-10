import React from 'react';
import { Layout } from 'antd';
import UserList from './UserList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt; Security &gt; <span className="page-header-title">Users</span></span>
    </Header>
    <Content className="page-content">
      <UserList />
    </Content>
  </Layout>
);
