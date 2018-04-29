import React, { Component } from 'react';
import axios from 'axios';
import { Table, Checkbox } from 'antd';
import moment from 'moment';
import showError from '../../../../utils/ShowError';

const Column = Table.Column;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getPortofoliosUrl = courseId => `${COURSES_URL}/${courseId}/portofolios`;

class PortofolioList extends Component {
  state = {
    sgls: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
  }
  componentDidMount() {
    this.fetchPortofolios();
  }

  fetchPortofolios() {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getPortofoliosUrl(courseId), { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          sgls: response.data.rows,
          count: response.data.count,
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

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchPortofolios(); });
  }

  render() {
    return (
      <div style={{ marginTop: -15 }}>
        <Table
          dataSource={this.state.sgls}
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
            dataIndex="PortofolioType.name"
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

export default PortofolioList;
