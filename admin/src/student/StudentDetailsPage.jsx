import React, { Component } from 'react';
import { Layout, Steps, Row, Col, Button, message, Icon, Menu, Dropdown } from 'antd';
import RegistrationForm from './RegistrationForm';
import CourseList from './course/CourseList';
import AddCourseByLevelWindow from './course/AddCourseByLevelWindow';
import AddCourseByDepartmentWindow from './course/AddCourseByDepartmentWindow';

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
  closeAddCourseByLevelWindow = () => {
    this.setState({
      addCourseByLevelWindowVisible: false,
    });
  }
  closeAddCourseByDepartmentWindow = () => {
    this.setState({
      addCourseByDepartmentWindowVisible: false,
    });
  }
  render() {
    const { current } = this.state;
    const menu = (
      <Menu
        onClick={({ key }) => {
          switch (key) {
            case '1':
              this.setState({
                addCourseByLevelWindowVisible: true,
              });
              break;
            case '2':
              this.setState({
                addCourseByDepartmentWindowVisible: true,
              });
              break;
            default:
          }
        }}
      >
        <Menu.Item key="1">By Level</Menu.Item>
        <Menu.Item key="2">By Department</Menu.Item>
      </Menu>
    );
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
              <Row gutter={20}>
                <Col span={18}>
                  <CourseList courses={[{
                      Department: {
                        code: 'ABC',
                      },
                      title: 'Title',
                      status: 0,
                    }]} />
                </Col>
                <Col span={2}>
                  <Dropdown overlay={menu}>
                    <Button type="primary" style={{ marginLeft: 10 }}>
                      Add <Icon type="down" />
                    </Button>
                  </Dropdown>
                </Col>
                <Col span={2}>
                  <Button>Chart <Icon type="layout" /></Button>
                </Col>
              </Row>
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
          <AddCourseByLevelWindow
            visible={this.state.addCourseByLevelWindowVisible}
            onSaveSuccess={this.onSaveSuccess}
            onCancel={this.closeAddCourseByLevelWindow}
            onClose={this.closeAddCourseByLevelWindow}
            ref={obj => (this.addCourseByLevelWindow = obj)}
          />
          <AddCourseByDepartmentWindow
            visible={this.state.addCourseByDepartmentWindowVisible}
            onSaveSuccess={this.onSaveSuccess}
            onCancel={this.closeAddCourseByDepartmentWindow}
            onClose={this.closeAddCourseByDepartmentWindow}
            ref={obj => (this.addCourseByDepartmentWindow = obj)}
          />
        </Content>
      </Layout>
    );
  }
}
