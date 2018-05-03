import React from 'react';
import { Layout } from 'antd';
import ParticipantList from './ParticipantList';

const { Header, Content } = Layout;

export default ({ history, match }) => (
  <Layout style={{ height: '100%' }}>
    <Header className="page-header">
      <span role="link" onClick={() => (history.push('/seminars'))}>Seminars &gt;</span><span className="page-header-title"> Participants</span>
    </Header>
    <Content className="page-content">
      <ParticipantList match={match} />
    </Content>
  </Layout>
);
