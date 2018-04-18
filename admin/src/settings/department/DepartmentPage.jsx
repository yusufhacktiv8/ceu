import React from 'react';
import { Layout } from 'antd';
import DepartmentList from './DepartmentList';

const { Header, Content } = Layout;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Settings &gt; </span><span className="page-header-title"> Departments</span>
    </Header>
    <Content className="page-content">
      <DepartmentList />
    </Content>
  </Layout>
);
