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
    seminars: [],
    loading: false,
  }
  componentDidMount() {
    this.fetchSeminars();
  }

  fetchSeminars() {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getSeminarsUrl(courseId), { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
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
      <div style={{ marginTop: -15 }}>
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
