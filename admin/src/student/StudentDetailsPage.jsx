import React, { Component } from 'react';
import axios from 'axios';
import { Layout, Steps, Row, Col, Button, Tag, message, Icon, Spin } from 'antd';
import RegistrationForm from './RegistrationForm';
import CoursePage from './course/CoursePage';
import YudisiumPage from './yudisium/YudisiumPage';
import showError from '../utils/ShowError';

const { Header, Content } = Layout;
const { Step } = Steps;
const stepsCount = 6;

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

export default class StudentDetailsPage extends Component {
  state = {
    current: 0,
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
                  <RegistrationForm loading={loading} student={student} />
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
              <CoursePage studentId={studentId} level={2} history={this.props.history} />
            }

            {
              this.state.current === 3
              &&
              <YudisiumPage studentId={studentId} level={2} history={this.props.history} />
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
