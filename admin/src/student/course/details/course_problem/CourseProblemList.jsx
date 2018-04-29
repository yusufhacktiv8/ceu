import React, { Component } from 'react';
import axios from 'axios';
import { Table, Checkbox, Button, Popconfirm } from 'antd';
import moment from 'moment';
import showError from '../../../../utils/ShowError';

const Column = Table.Column;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getCourseProblemsUrl = courseId => `${COURSES_URL}/${courseId}/courseproblems`;

class CourseProblemList extends Component {
  state = {
    courseProblems: [],
    loading: false,
  }
  componentDidMount() {
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

  render() {
    return (
      <div style={{ marginTop: -15 }}>
        <Table
          dataSource={this.state.courseProblems}
          style={{ marginTop: 20 }}
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
                  title={`Are you sure delete course problem ${record.name}`}
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
      </div>
    );
  }
}

export default CourseProblemList;
