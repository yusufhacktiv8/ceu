import React, { Component } from 'react';
import { Layout, Tabs, Spin, Icon, Tag } from 'antd';
import axios from 'axios';
import InfoForm from '../student/course/details/InfoForm';
import SglList from './SglList';
import showError from '../utils/ShowError';

const { Header, Content } = Layout;
const TabPane = Tabs.TabPane;

const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default class CourseDetailsPage extends Component {
  state = {
    course: {},
    loading: false,
  }
  componentDidMount() {
    this.fetchCourse();
  }

  goToCoursesPage = () => {
    const { match } = this.props;
    const { studentId } = match.params;
    this.props.history.push(`/students/${studentId}/courses`);
  }

  goToStudentsPage = () => {
    this.props.history.push('/students');
  }

  fetchCourse = () => {
    const { match } = this.props;
    const { courseId } = match.params;
    this.setState({
      loading: true,
    });
    axios.get(`${COURSES_URL}/${courseId}`, {})
      .then((response) => {
        this.setState({
          course: response.data,
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

  render() {
    const { match } = this.props;
    const { courseId } = match.params;
    console.log('================> ', ((this.state.course && this.state.course.Department) ? this.state.course.Department.id : undefined));
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="page-header">
          <span role="link" onClick={this.goToStudentsPage}>Students &gt;</span>
          <span role="link" onClick={this.goToCoursesPage}> Courses &gt;</span>
          <span className="page-header-title"> Details</span>
        </Header>
        <Content className="page-content">
          {
            this.state.loading ?
              (
                <Spin indicator={spinIcon} style={{ marginBottom: 15 }} />
              ) :
              (
                <div>
                  <Tag color="#F50" style={{ height: 26, marginBottom: 15, fontSize: 15 }}>
                    {this.state.course.Student ? this.state.course.Student.name : ''}
                  </Tag>
                  <Tag style={{ height: 26, marginBottom: 15, fontSize: 15 }}>
                    {this.state.course.Student ? `${this.state.course.Student.oldSid} - ${this.state.course.Student.newSid}` : ''}
                  </Tag>
                  <Tag style={{ height: 26, marginBottom: 15, fontSize: 15 }}>
                    {this.state.course.Department ? this.state.course.Department.code : ''}
                  </Tag>
                </div>
              )
          }
          <Tabs
            defaultActiveKey="1"
            style={{ marginTop: -10, height: 500 }}
          >
            <TabPane tab="Info" key="1">
              <InfoForm
                courseId={courseId}
                ref={(infoForm) => { this.infoForm = infoForm; }}
              />
            </TabPane>
            <TabPane tab="SGL" key="2" forceRender>
              <SglList
                courseId={courseId}
                departmentId={(this.state.course && this.state.course.Department) ? this.state.course.Department.id : undefined}
                ref={(scheduleList) => { this.scheduleList = scheduleList; }}
              />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    );
  }
}
