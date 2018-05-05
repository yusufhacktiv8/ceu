import React from 'react';
import { Layout, Row, Col, Card } from 'antd';
import Chart1 from './Chart1';
import StudentCountChart from './StudentCountChart';

const { Header, Content } = Layout;

export default ({ history }) => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span className="page-header-title">Dashboard</span>
    </Header>
    <Content className="page-content">
      <Row gutter={20}>
        <Col span={12}>
          <Card title="Student by Level" type="inner">
            <div style={{ width: '100%', textAlign: 'center' }}>
              <StudentCountChart />
            </div>
          </Card>
        </Col>
        <Col span={12}>
        </Col>
      </Row>
      <Row gutter={20} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="MPPD Level 1" type="inner">
            <Chart1 level={1} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="MPPD Level 2" type="inner">
            <Chart1 level={2} />
          </Card>
        </Col>
      </Row>
    </Content>
  </Layout>
);
