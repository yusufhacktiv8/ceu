import React, { Component } from 'react';
import axios from 'axios';
import { Table, Checkbox } from 'antd';
import moment from 'moment';
import showError from '../../../../utils/ShowError';

const Column = Table.Column;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getSglsUrl = courseId => `${COURSES_URL}/${courseId}/sgls`;

class SglList extends Component {
  state = {
    sgls: [],
    loading: false,
  }

  componentDidMount() {
    this.fetchSgls();
  }

  fetchSgls() {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getSglsUrl(courseId), { params: {} })
      .then((response) => {
        this.setState({
          sgls: response.data,
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
          dataSource={this.state.sgls}
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
            title="Type"
            dataIndex="SglType.name"
            key="type"
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
        </Table>
      </div>
    );
  }
}

export default SglList;
