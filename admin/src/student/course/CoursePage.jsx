import React, { Component } from 'react';
import { Menu, Row, Col, Button, Icon, Dropdown, Spin } from 'antd';
import axios from 'axios';
import AddCourseByLevelWindow from '../course/AddCourseByLevelWindow';
import AddCourseByDepartmentWindow from '../course/AddCourseByDepartmentWindow';
import CourseList from './CourseList';
import showError from '../../utils/ShowError';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const getCourseURL = studentId => `${STUDENTS_URL}/${studentId}/courses`;

export default class CoursePage extends Component {
  state = {
    courses: [],
    loading: false,
    addCourseByLevelWindowVisible: false,
    addCourseByDepartmentWindowVisible: false,
  }

  componentDidMount() {
    this.fetchCourses();
  }

  onSaveByLevelSuccess = () => {
    this.closeAddCourseByLevelWindow();
    this.fetchCourses();
  }

  onSaveByDepartmentSuccess = () => {
    this.closeAddCourseByDepartmentWindow();
    this.fetchCourses();
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

  fetchCourses() {
    const { studentId, level } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getCourseURL(studentId), { params: {
      level,
    } })
      .then((response) => {
        this.setState({
          courses: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  showDetails = (course) => {
    this.props.history.push(`/students/${this.props.studentId}/courses/${course.id}`);
  }

  render() {
    const { studentId, level } = this.props;
    const menu = (
      <Menu
        onClick={({ key }) => {
          switch (key) {
            case '1':
              this.setState({
                addCourseByLevelWindowVisible: true,
              });
              this.addCourseByLevelWindow.resetFields();
              break;
            case '2':
              this.setState({
                addCourseByDepartmentWindowVisible: true,
              });
              this.addCourseByDepartmentWindow.resetFields();
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
          <Spin spinning={this.state.loading}>
            <CourseList courses={this.state.courses} showDetails={this.showDetails} />
          </Spin>
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
          studentId={studentId}
          level={level}
          visible={this.state.addCourseByLevelWindowVisible}
          onSaveSuccess={this.onSaveByLevelSuccess}
          onCancel={this.closeAddCourseByLevelWindow}
          onClose={this.closeAddCourseByLevelWindow}
          ref={obj => (this.addCourseByLevelWindow = obj)}
        />
        <AddCourseByDepartmentWindow
          studentId={studentId}
          level={level}
          visible={this.state.addCourseByDepartmentWindowVisible}
          onSaveSuccess={this.onSaveByDepartmentSuccess}
          onCancel={this.closeAddCourseByDepartmentWindow}
          onClose={this.closeAddCourseByDepartmentWindow}
          ref={obj => (this.addCourseByDepartmentWindow = obj)}
        />
      </Row>
    );
  }
}
