import React, { Component } from 'react';
import axios from 'axios';
import { Table, Checkbox, Button, Popconfirm, Row, Col, message } from 'antd';
import moment from 'moment';
import showError from '../../../../utils/ShowError';
import CourseProblemWindow from './CourseProblemWindow';

const Column = Table.Column;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getCourseProblemsUrl = courseId => `${COURSES_URL}/${courseId}/courseproblems`;

const COURSE_PROBLEMS_URL = `${process.env.REACT_APP_SERVER_URL}/api/courseproblems`;

class CourseProblemList extends Component {
  state = {
    courseProblem: {},
    courseProblems: [],
    loading: false,
  }
  componentDidMount() {
    this.fetchCourseProblems();
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchCourseProblems();
  }

  fetchCourseProblems() {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getCourseProblemsUrl(courseId), { params: {} })
      .then((response) => {
        this.setState({
          courseProblems: response.data,
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

  deleteCourseProblem(record) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${COURSE_PROBLEMS_URL}/${record.id}`)
      .then(() => {
        message.success('Delete courseProblem success');
        this.fetchCourseProblems();
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
      });
  }

  openEditWindow = (record) => {
    this.setState({
      courseProblem: record,
      courseProblemWindowVisible: true,
    }, () => {
      this.courseProblemWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      courseProblemWindowVisible: false,
    });
  }

  render() {
    const { courseId } = this.props;
    return (
      <div style={{ marginTop: -5 }}>
        <Row gutter={10}>
          <Col span={16}>
            <span>
              <Button
                type="primary"
                shape="circle"
                icon="plus"
                onClick={() => this.openEditWindow({})}
              />
            </span>
          </Col>
        </Row>
        <Table
          dataSource={this.state.courseProblems}
          style={{ marginTop: 10 }}
          rowKey="id"
          loading={this.state.loading}
          size="small"
        >
          <Column
            title="Completed"
            dataIndex="completed"
            render={(text, record) => (
              <span>
                <Checkbox checked={record.completed} />
              </span>
            )}
          />
          <Column
            title="Title"
            dataIndex="title"
            key="title"
          />
          <Column
            title="Type"
            dataIndex="CourseProblemType.name"
          />
          <Column
            title="Date"
            dataIndex="problemDate"
            key="problemDate"
            render={(text, record) => (
              <span>
                {moment(text).format('DD/MM/YYYY')}
              </span>
            )}
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <span>
                <Button
                  icon="ellipsis"
                  size="small"
                  onClick={() => this.openEditWindow(record)}
                  style={{ marginRight: 5 }}
                />
                <Popconfirm
                  title={`Are you sure delete course problem ${record.title}`}
                  onConfirm={() => this.deleteCourseProblem(record)}
                  okText="Yes" cancelText="No"
                >
                  <Button
                    type="danger"
                    icon="delete"
                    size="small"
                  />
                </Popconfirm>
              </span>
            )}
          />
        </Table>
        <CourseProblemWindow
          courseId={courseId}
          visible={this.state.courseProblemWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          courseProblem={this.state.courseProblem}
          ref={courseProblemWindow => (this.courseProblemWindow = courseProblemWindow)}
        />
      </div>
    );
  }
}

export default CourseProblemList;
