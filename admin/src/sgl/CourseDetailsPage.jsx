import React, { Component } from 'react';
import { Layout, Tabs, Spin, Icon, Tag, Button, Modal, message } from 'antd';
import axios from 'axios';
import InfoForm from '../student/course/details/InfoForm';
import ScheduleForm from '../student/course/details/schedule/ScheduleForm';
import CourseProblemList from '../student/course/details/course_problem/CourseProblemList';
import ScoreList from '../student/course/details/score/ScoreList';
import showError from '../utils/ShowError';
import { dateFormat } from '../constant';

const { Header, Content } = Layout;
const TabPane = Tabs.TabPane;

const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
const { confirm } = Modal;

const fixDates = (data) => {
  const result = { ...data };
  if (data.planDate && data.planDate.length > 1) {
    result.planDate = [data.planDate[0].format(dateFormat),
      data.planDate[1].format(dateFormat)];
  }
  if (data.realStartDate) {
    result.realStartDate = data.realStartDate.format(dateFormat);
  }
  if (data.realEndDate) {
    result.realEndDate = data.realEndDate.format(dateFormat);
  }

  if (data.planDate1 && data.planDate1.length > 1) {
    result.planDate1 = [data.planDate1[0].format(dateFormat),
      data.planDate1[1].format(dateFormat)];
  }
  if (data.realStartDate1) {
    result.realStartDate1 = data.realStartDate1.format(dateFormat);
  }
  if (data.realEndDate1) {
    result.realEndDate1 = data.realEndDate1.format(dateFormat);
  }

  if (data.planDate2 && data.planDate2.length > 1) {
    result.planDate2 = [data.planDate2[0].format(dateFormat),
      data.planDate2[1].format(dateFormat)];
  }
  if (data.realStartDate2) {
    result.realStartDate2 = data.realStartDate2.format(dateFormat);
  }
  if (data.realEndDate2) {
    result.realEndDate2 = data.realEndDate2.format(dateFormat);
  }

  if (data.planDate3 && data.planDate3.length > 1) {
    result.planDate3 = [data.planDate3[0].format(dateFormat),
      data.planDate3[1].format(dateFormat)];
  }
  if (data.realStartDate3) {
    result.realStartDate3 = data.realStartDate3.format(dateFormat);
  }
  if (data.realEndDate3) {
    result.realEndDate3 = data.realEndDate3.format(dateFormat);
  }
  return result;
};

export default class CourseDetailsPage extends Component {
  state = {
    course: {},
    loading: false,
    saving: false,
    pending: false,
    deleting: false,
  }
  componentDidMount() {
    this.fetchCourse();
  }

  onSave = () => {
    const { match } = this.props;
    const { courseId } = match.params;
    const { infoForm, scheduleForm } = this;
    infoForm.validateFields((err, infoFormValues) => {
      if (!err) {
        scheduleForm.validateFields((err2, scheduleFormValues) => {
          if (!err2) {
            this.setState({
              saving: true,
            });
            const data = { ...infoFormValues, ...scheduleFormValues };
            if (data.hospital1 && data.hospital1.id) {
              data.hospital1 = data.hospital1.id;
            }
            if (data.clinic && data.clinic.id) {
              data.clinic = data.clinic.id;
            }

            const normalizedDatesData = fixDates(data);

            const axiosObj = axios.put(`${COURSES_URL}/${courseId}`, normalizedDatesData);
            axiosObj.then(() => {
              message.success('Saving course success');
              this.setState({
                saving: false,
              }, () => {
                this.goToCoursePage();
              });
            })
              .catch((error) => {
                this.setState({
                  saving: false,
                });
                showError(error);
              });
          }
        });
      }
    });
  }

  goToCoursePage = () => {
    this.props.history.push('/courses');
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
    const { saving, course, pending, deleting } = this.state;
    const { title } = course;
    const buttons = [
      <Button loading={saving} style={{ marginLeft: 8 }} key="save" type="primary" size="small" onClick={this.onSave}>
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
              <InfoForm
                courseId={courseId}
                ref={(infoForm) => { this.infoForm = infoForm; }}
              />
            </TabPane>
            <TabPane tab="Schedules" key="3" forceRender>
              <ScheduleForm
                courseId={courseId}
                ref={(scheduleForm) => { this.scheduleForm = scheduleForm; }}
              />
            </TabPane>
            <TabPane tab="Scores" key="4" forceRender>
              <ScoreList
                courseId={courseId}
                ref={(scoreListForm) => { this.scoreListForm = scoreListForm; }}
              />
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
