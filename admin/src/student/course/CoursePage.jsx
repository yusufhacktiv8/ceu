import React, { Component } from 'react';
import { Menu, Row, Col, Button, Tag, Icon, Dropdown, Spin } from 'antd';
import { PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import AddCourseByLevelWindow from '../course/AddCourseByLevelWindow';
import AddCourseByDepartmentWindow from '../course/AddCourseByDepartmentWindow';
import CourseChartWindow from './details/CourseChartWindow';
import CourseList from './CourseList';
import showError from '../../utils/ShowError';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const getCourseURL = studentId => `${STUDENTS_URL}/${studentId}/courses`;

const COLORS = ['#5093E1', '#50C14E', '#F65177', '#9DA5BE', '#000'];

export default class CoursePage extends Component {
  state = {
    courses: [],
    loading: false,
    addCourseByLevelWindowVisible: false,
    addCourseByDepartmentWindowVisible: false,
    courseChartWindowVisible: false,
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

  openCourseChartWindow = () => {
    this.setState({
      courseChartWindowVisible: true,
    });
  }

  closeCourseChartWindow = () => {
    this.setState({
      courseChartWindowVisible: false,
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

    const { courses } = this.state;
    const onGoingCount = courses.filter(course => course.status === 1).length;
    const completedCount = courses.filter(course => course.status === 2).length;
    const scheduledCount = courses.filter(course => course.status === 0).length;
    const problemCount = courses.filter(course => course.status === 3).length;
    const pendingCount = courses.filter(course => course.status === 4).length;
    const data = [
      {
        name: 'On Going',
        value: onGoingCount,
      },
      {
        name: 'Completed',
        value: completedCount,
      },
      {
        name: 'Problem',
        value: problemCount,
      },
      {
        name: 'Scheduled',
        value: scheduledCount,
      },
      {
        name: 'Pending',
        value: pendingCount,
      },
    ];
    return (
      <Row gutter={20}>
        <Col span={16}>
          <Spin spinning={this.state.loading}>
            <CourseList courses={this.state.courses} showDetails={this.showDetails} />
          </Spin>
        </Col>
        <Col span={8}>
          <Row gutter={10}>
            <Col span={6}>
              <Dropdown overlay={menu}>
                <Button type="primary" style={{ marginLeft: 12 }}>
                  Add <Icon type="down" />
                </Button>
              </Dropdown>
            </Col>
            <Col span={6}>
              <Button onClick={this.openCourseChartWindow}>Chart <Icon type="layout" /></Button>
            </Col>
            <Col span={6}>
              <Button onClick={this.openCourseChartWindow}>Pre-Requisite <Icon type="file-text" /></Button>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <div style={{ position: 'relative', top: 72, left: 56, textAlign: 'center', width: 100 }}>
                <span style={{ fontSize: 30, fontWeight: 'bold', color: 'gray' }}>
                  {courses.length}
                </span><br />
                <span style={{ fontWeight: 'bold' }}>Courses</span>
              </div>
              <div>
                <PieChart style={{ top: -40 }} width={200} height={170}>
                  <Pie
                    data={data}
                    cx={100}
                    cy={80}
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={0}
                    label={false}
                    dataKey="value"
                  >
                    {
                      data.map((entry, index) => (
                        <Cell
                          key={COLORS[index % COLORS.length]}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))
                    }
                  </Pie>
                </PieChart>
              </div>
            </Col>
            <Col span={12} style={{ paddingLeft: 20 }}>
              <div style={{ marginTop: 60 }}><Tag color="#9DA5BE">{scheduledCount}</Tag> Scheduled </div>
              <div style={{ marginTop: 5 }}><Tag color="#5093E1">{onGoingCount}</Tag> On Going </div>
              <div style={{ marginTop: 5 }}><Tag color="#50C14E">{completedCount}</Tag> Completed </div>
              <div style={{ marginTop: 5 }}><Tag color="#F65177">{problemCount}</Tag> Problem </div>
              <div style={{ marginTop: 5 }}><Tag color="#000">{pendingCount}</Tag> Pending </div>
            </Col>
          </Row>
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

        <CourseChartWindow
          visible={this.state.courseChartWindowVisible}
          level={level}
          courses={this.state.courses}
          onCancel={this.closeCourseChartWindow}
          onClose={this.closeCourseChartWindow}
        />
      </Row>
    );
  }
}
