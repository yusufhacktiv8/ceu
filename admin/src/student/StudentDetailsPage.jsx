import React from 'react';
import { Layout, Steps } from 'antd';

const { Header, Content } = Layout;
const { Step } = Steps;

export default () => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span>Students &gt;</span><span className="page-header-title"> Details</span>
    </Header>
    <Content className="page-content">
      <Steps current={1}>
        <Step title="Registration" description="This is a description." />
        <Step title="Level 1" description="This is a description." />
        <Step title="Level 2" description="This is a description." />
        <Step title="Yudisium" description="This is a description." />
        <Step title="UKMPPD" description="This is a description." />
        <Step title="Graduate" description="This is a description." />
      </Steps>
    </Content>
  </Layout>
);
