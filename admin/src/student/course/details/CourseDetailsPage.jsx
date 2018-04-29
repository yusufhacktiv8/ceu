import React, { Component } from 'react';
import { Layout, Tabs, Spin, Icon, Tag, Button, Modal, message } from 'antd';
import axios from 'axios';
import InfoForm from './InfoForm';
import SglList from './sgl/SglList';
import ScheduleForm from './schedule/ScheduleForm';
import PortofolioList from './portofolio/PortofolioList';
import SeminarList from './seminar/SeminarList';
import CourseProblemList from './course_problem/CourseProblemList';
import showError from '../../../utils/ShowError';

const { Header, Content } = Layout;
const TabPane = Tabs.TabPane;

const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const { confirm } = Modal;

export default class CourseDetailsPage extends Component {
  state = {
    course: {},
    loading: false,
    saving: false,
    pending: false,
  }
  componentDidMount() {
    this.fetchCourse();
  }

  goToStudentPage = () => {
    this.props.history.push('/students');
  }

  goToStudentDetailsPage = () => {
    const { match } = this.props;
    const { studentId } = match.params;
    this.props.history.push(`/students/${studentId}`);
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

  confirmPending = (title, courseId) => {
    const onSaveSuccess = () => {
      this.fetchCourse();
    };

    const onOk = () => {
      const axiosObj = axios.put(`${COURSES_URL}/${courseId}/pending`);
      this.setState({
        pending: true,
      });
      axiosObj.then(() => {
        message.success('Pending course success');
        this.setState({
          pending: false,
        }, () => {
          onSaveSuccess();
        });
      })
        .catch((error) => {
          this.setState({
            pending: false,
          });
          showError(error);
        });
    };

    confirm({
      title: `Do you want to pending this course ${title}?`,
      onOk,
    });
  }

  confirmUnPending = (title, courseId) => {
    const onSaveSuccess = () => {
      this.fetchCourse();
    };

    const onOk = () => {
      const axiosObj = axios.put(`${COURSES_URL}/${courseId}/unpending`);
      this.setState({
        pending: true,
      });
      axiosObj.then(() => {
        message.success('Unpending course success');
        this.setState({
          pending: false,
        }, () => {
          onSaveSuccess();
        });
      })
        .catch((error) => {
          this.setState({
            pending: false,
          });
          showError(error);
        });
    };

    confirm({
      title: `Do you want to unpending this course ${title}?`,
      onOk,
    });
  }

  render() {
    const { match } = this.props;
    const { courseId } = match.params;
    const { saving, course } = this.state;
    const { title } = course;
    console.log(course);
    const buttons = [course.status !== 4 ?
      <Button loading={this.state.pending} key="pending" type="danger" size="small" onClick={() => this.confirmPending(title, courseId)}>Pending</Button>
      :
      <Button key="unPending" type="default" size="small" onClick={() => this.confirmUnPending(title, courseId)}>Un Pending</Button>,

      <Button style={{ marginLeft: 8 }} key="delete" type="danger" size="small" onClick={() => this.confirmDelete(title, courseId)}>Delete</Button>,
      <Button style={{ marginLeft: 8 }} key="save" type="primary" size="small" loading={saving} onClick={this.onSave}>
        Save
      </Button>,
    ]
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="page-header">
          <span role="link" onClick={this.goToStudentPage}>Students &gt;</span>
          <span role="link" onClick={this.goToStudentDetailsPage}> Details &gt;</span>
          <span className="page-header-title"> Course</span>
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
            tabBarExtraContent={buttons}
            style={{ marginTop: -10, height: 500 }}
          >
            <TabPane tab="Info" key="1">
              <InfoForm courseId={courseId} />
            </TabPane>
            <TabPane tab="SGL" key="2">
              <SglList courseId={courseId} />
            </TabPane>
            <TabPane tab="Schedules" key="3">
              <ScheduleForm courseId={courseId} />
            </TabPane>
            <TabPane tab="Portofolios" key="4">
              <PortofolioList courseId={courseId} />
            </TabPane>
            <TabPane tab="Seminars" key="5">
              <SeminarList courseId={courseId} />
            </TabPane>
            <TabPane tab="Problems" key="6">
              <CourseProblemList courseId={courseId} />
            </TabPane>
          </Tabs>
        </Content>
      </Layout>
    );
  }
}
