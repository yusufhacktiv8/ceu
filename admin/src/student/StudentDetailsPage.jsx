import React, { Component } from 'react';
import { Layout, Steps, Row, Col, Button, message, Icon, Dropdown } from 'antd';
import RegistrationForm from './RegistrationForm';
import CoursePage from './course/CoursePage';

const { Header, Content } = Layout;
const { Step } = Steps;
const stepsCount = 6;

export default class StudentDetailsPage extends Component {
  state = {
    current: 1,
    addCourseByLevelWindowVisible: false,
    addCourseByDepartmentWindowVisible: false,
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current } = this.state;
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="page-header">
          <span>Students &gt;</span><span className="page-header-title"> Details</span>
        </Header>
        <Content className="page-content">
          <Steps current={current}>
            <Step title="Registration" />
            <Step title="Level 1" />
            <Step title="Level 2" />
            <Step title="Yudisium" />
            <Step title="UKMPPD" />
            <Step title="Graduate" />
          </Steps>
          <div className="steps-content">
            {
              this.state.current === 0
              &&
              <Row>
                <Col span={12}>
                  <RegistrationForm student={{}} />
                </Col>
              </Row>
            }

            {
              this.state.current === 1
              &&
              <CoursePage level={1} />
            }

            {
              this.state.current === 2
              &&
              <CoursePage level={2} />
            }
          </div>
          <div className="steps-action">
            {
              this.state.current > 0
              &&
              <Button style={{ marginRight: 8 }} onClick={() => this.prev()}><Icon type="left" /> Prev</Button>
            }
            {
              this.state.current < stepsCount - 1
              &&
              <Button onClick={() => this.next()}>Next <Icon type="right" /></Button>
            }
            {
              this.state.current === stepsCount - 1
              &&
              <Button type="primary" onClick={() => message.success('Processing complete!')}>Done</Button>
            }
          </div>
        </Content>
      </Layout>
    );
  }
}
