import React, { Component } from 'react';
import axios from 'axios';
import { Table } from 'antd';
import moment from 'moment';
import showError from '../../../../utils/ShowError';

const Column = Table.Column;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getSeminarsUrl = courseId => `${COURSES_URL}/${courseId}/courseseminars`;

class SeminarList extends Component {
  state = {
    course: {},
    seminars: [],
    loading: false,
  }
  componentDidMount() {
    this.fetchCourse();
  }

  fetchCourse = () => {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(`${COURSES_URL}/${courseId}`, {})
      .then((response) => {
        this.setState({
          course: response.data,
          loading: false,
        }, () => {
          this.fetchSeminars();
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

  fetchSeminars() {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    const realStartDate = this.state.course.realStartDate;
    const realEndDate = this.state.course.realEndDate;
    const startDate = realStartDate ? realStartDate.value : null;
    const endDate = realEndDate ? realEndDate.value : null;
    axios.get(getSeminarsUrl(courseId), { params: {
      startDate,
      endDate,
    } })
      .then((response) => {
        this.setState({
          seminars: response.data,
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
      <div style={{ marginTop: -15, overflow: 'scroll', height: 400 }}>
        <Table
          dataSource={this.state.seminars}
          style={{ marginTop: 20 }}
          rowKey="id"
          loading={this.state.loading}
          size="small"
        >
          <Column
            title="Title"
            dataIndex="name"
            key="name"
          />
          <Column
            title="Date"
            dataIndex="eventDate"
            key="eventDate"
            render={(text, record) => (
              <span>
                {moment(text).format('DD/MM/YYYY')}
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default SeminarList;
