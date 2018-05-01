import React from 'react';
import { Tabs } from 'antd';
import AssistanceList from './AssistanceList';

const { TabPane } = Tabs;

export default ({ studentId }) => (
  <Tabs
    defaultActiveKey="1"
    style={{ marginTop: -10, height: 300 }}
  >
    <TabPane tab="Assistance" key="1">
      <AssistanceList studentId={studentId} />
    </TabPane>
    <TabPane tab="Scores" key="2">

    </TabPane>
  </Tabs>
);
