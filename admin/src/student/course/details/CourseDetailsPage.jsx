import React, { Component } from 'react';
import { Layout, Tabs } from 'antd';
import InfoForm from './InfoForm';

const { Header, Content } = Layout;
const TabPane = Tabs.TabPane;

export default class CourseDetailsPage extends Component {
  state = {
    course: {},
  }
  goToStudentPage = () => {
    this.props.history.push('/students');
  }
  goToStudentDetailsPage = () => {
    const { match } = this.props;
    const { studentId } = match.params;
    this.props.history.push(`/students/${studentId}`);
  }
  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="page-header">
          <span role="link" onClick={this.goToStudentPage}>Students &gt;</span>
          <span role="link" onClick={this.goToStudentDetailsPage}> Details &gt;</span>
          <span className="page-header-title"> Course</span>
        </Header>
        <Content className="page-content">
          <Tabs defaultActiveKey="1" style={{ marginTop: -10, height: 500 }}>
            <TabPane tab="Info" key="1">
              <InfoForm course={this.state.course} />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    );
  }
}
