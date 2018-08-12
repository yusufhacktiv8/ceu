import React, { Component } from 'react';
import axios from 'axios';
import { Layout, Steps, Row, Col, Button, Tag, message, Icon, Spin } from 'antd';
import RegistrationForm from './RegistrationForm';
import CoursePage from './course/CoursePage';
import YudisiumPage from './yudisium/YudisiumPage';
import Yudisium2Page from './yudisium/Yudisium2Page';
import AssistancePage from './assistance/AssistancePage';
import UkmppdPage from './ukmppd/UkmppdPage';
import TryOutPage from './tryout/TryOutPage';
import GraduatePage from './graduate/GraduatePage';
import showError from '../utils/ShowError';

const { Header, Content } = Layout;
const { Step } = Steps;
const stepsCount = 9;

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default class StudentDetailsPage extends Component {
  state = {
    current: 1,
    student: {},
    addCourseByLevelWindowVisible: false,
    addCourseByDepartmentWindowVisible: false,
  }

  componentDidMount() {
    this.fetchStudent();
  }
  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }
  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  goToStudentPage = () => {
    this.props.history.push('/students');
  }

  onStudentUpdate = () => {
    this.fetchStudent();
  }

  fetchStudent = () => {
    const { match } = this.props;
    const { studentId } = match.params;
    this.setState({
      loading: true,
    });
    axios.get(`${STUDENTS_URL}/${studentId}`, {})
      .then((response) => {
        this.setState({
          student: response.data,
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
    const { current, student, loading } = this.state;
    const { match } = this.props;
    const { studentId } = match.params;
    return (
      <Layout style={{ height: '100%' }}>
        <Header className="page-header">
          <span role="link" onClick={this.goToStudentPage}>Students &gt;</span><span className="page-header-title"> Details</span>
        </Header>
        <Content className="page-content" style={{ paddingTop: 15 }}>
          {
            this.state.loading ?
              (
                <Spin indicator={spinIcon} style={{ marginBottom: 15 }} />
              ) :
              (
                <div>
                  <Tag color="#F50" style={{ height: 26, marginBottom: 15, fontSize: 15 }}>
                    {this.state.student.name}
                  </Tag>
                  <Tag style={{ height: 26, marginBottom: 15, fontSize: 15 }}>
                    {this.state.student.oldSid} - {this.state.student.newSid}
                  </Tag>
                </div>
              )
          }

          <Steps current={current}>
            <Step title="Registration" />
            <Step title="Level 1" />
            <Step title="Yudisium 1" />
            <Step title="Level 2" />
            <Step title="Assistance" />
            <Step title="Try Out" />
            <Step title="Yudisium 2" />
            <Step title="UKMPPD" />
            <Step title="Graduate" />
          </Steps>
          <div className="steps-content">
            {
              this.state.current === 0
              &&
              <Row>
                <Col span={12}>
                  <RegistrationForm
                    loading={loading}
                    student={student}
                    onStudentUpdate={this.onStudentUpdate}
                    studentId={studentId}
                  />
                </Col>
              </Row>
            }

            {
              this.state.current === 1
              &&
              <CoursePage studentId={studentId} level={1} history={this.props.history} />
            }

            {
              this.state.current === 2
              &&
              <YudisiumPage studentId={studentId} level={1} history={this.props.history} />
            }

            {
              this.state.current === 3
              &&
              <CoursePage studentId={studentId} level={2} history={this.props.history} />
            }

            {
              this.state.current === 4
              &&
              <AssistancePage studentId={studentId} level={2} history={this.props.history} />
            }

            {
              this.state.current === 5
              &&
              <TryOutPage studentId={studentId} history={this.props.history} />
            }

            {
              this.state.current === 6
              &&
              <Yudisium2Page studentId={studentId} history={this.props.history} />
            }

            {
              this.state.current === 7
              &&
              <UkmppdPage studentId={studentId} history={this.props.history} />
            }

            {
              this.state.current === 8
              &&
              <GraduatePage
                loading={loading}
                student={student}
                onStudentUpdate={this.onStudentUpdate}
                studentId={studentId}
              />
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
          </div>
        </Content>
      </Layout>
    );
  }
}
