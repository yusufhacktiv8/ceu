import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Tag, Spin, Row, Col, Icon, message, Popconfirm } from 'antd';
import showError from '../utils/ShowError';
import LevelSelect from '../student/LevelSelect';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const getCourseURL = studentId => `${STUDENTS_URL}/${studentId}/courses`;
const Column = Table.Column;

const spinIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

class CourseList extends Component {
  state = {
    level: 1,
    courses: [],
    loading: false,
    count: 0,
  }
  componentDidMount() {
    this.fetchCourses();
    this.fetchStudent();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchCourses();
  }

  fetchCourses() {
    const { match } = this.props;
    const { studentId } = match.params;
    const { level } = this.state;
    this.setState({
      loading: true,
    });
    axios.get(getCourseURL(studentId), { params: { level } })
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

  filterCourses = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchCourses(); });
  }

  fetchStudent = () => {
    const { match } = this.props;
    const { studentId } = match.params;
    this.setState({
      studentLoading: true,
    });
    axios.get(`${STUDENTS_URL}/${studentId}`, {})
      .then((response) => {
        this.setState({
          student: response.data,
          studentLoading: false,
        });
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        this.setState({
          studentLoading: false,
        });
      });
  }

  showDetails = (record) => {
    const studentId = record.Student.id;
    const courseId = record.id;
    this.props.history.push(`/students/${studentId}/courses/${courseId}`);
  }

  goToStudentsPage = () => {
    this.props.history.push('/students');
  }

  render() {
    return (
      <div>
        {
          this.state.studentLoading ?
            (
              <Spin indicator={spinIcon} style={{ marginBottom: 15 }} />
            ) :
            (
              <div>
                <Tag color="#F50" style={{ height: 26, marginBottom: 15, fontSize: 15 }}>
                  {this.state.student ? this.state.student.name : ''}
                </Tag>
                <Tag style={{ height: 26, marginBottom: 15, fontSize: 15 }}>
                  {this.state.student ? `${this.state.student.oldSid} - ${this.state.student.newSid}` : ''}
                </Tag>
              </div>
            )
        }
        <Row gutter={10}>
          <Col span={8}>
            <LevelSelect
              value={this.state.level}
              onChange={(e) => {
                this.setState({
                  level: e,
                });
              }}
            />
          </Col>
          <Col span={16}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterCourses}
                style={{ marginRight: 15 }}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.courses}
              style={{ marginTop: 20 }}
              rowKey="id"
              loading={this.state.loading}
              pagination={{
                total: this.state.count,
                current: this.state.currentPage,
                pageSize: this.state.pageSize,
              }}
              onChange={this.pageChanged}
              size="small"
            >
              <Column
                title="Title"
                dataIndex="title"
                key="title"
              />
              <Column
                title="Department"
                dataIndex="Department.name"
                render={(text, record) => (
                  <Tag className="CourseListItem-tag" color={record.Department.color} onClick={() => this.showDetails(record)}>
                    {text}
                  </Tag>
                )}
              />
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CourseList;
