import React, { Component } from 'react';
import { Menu, Row, Col, Button, Icon, Dropdown } from 'antd';
import AddCourseByLevelWindow from '../course/AddCourseByLevelWindow';
import AddCourseByDepartmentWindow from '../course/AddCourseByDepartmentWindow';

import CourseList from './CourseList';

export default class CoursePage extends Component {
  state = {
    addCourseByLevelWindowVisible: false,
    addCourseByDepartmentWindowVisible: false,
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
    const { level } = this.props;
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

        <AddCourseByLevelWindow
          level={level}
          visible={this.state.addCourseByLevelWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeAddCourseByLevelWindow}
          onClose={this.closeAddCourseByLevelWindow}
          ref={obj => (this.addCourseByLevelWindow = obj)}
        />
        <AddCourseByDepartmentWindow
          level={level}
          visible={this.state.addCourseByDepartmentWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeAddCourseByDepartmentWindow}
          onClose={this.closeAddCourseByDepartmentWindow}
          ref={obj => (this.addCourseByDepartmentWindow = obj)}
        />
      </Row>
    );
  }
}
