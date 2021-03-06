import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Input, Table, Button, DatePicker, Row, Col, message, Modal } from 'antd';
import showError from '../../utils/ShowError';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

const PRE_TEST_REPORTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/pretests`;
const PRE_TEST_DOWNLOAD_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/downloadpretest`;
const Column = Table.Column;

class PreTestList extends Component {
  state = {
    searchText: '',
    preTests: [],
    selectedRowKeys: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    exportWindowVisible: false,
  }
  componentDidMount() {
    this.fetchPreTests();
  }

  onRangeChange = (e) => {
    this.setState({
      dateRange: e,
    });
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeExportWindow();
    this.fetchPreTests();
  }

  fetchPreTests() {
    this.setState({
      loading: true,
    });
    axios.get(PRE_TEST_REPORTS_URL, { params: {
      searchText: this.state.searchText,
      dateRange: this.state.dateRange,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          preTests: response.data.rows,
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
    }, () => { this.fetchPreTests(); });
  }

  rowKeysChanged = (rowKeys) => {
    this.setState({
      selectedRowKeys: rowKeys,
    });
  }

  confirmDelete = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.error('No data to do action');
      return;
    }
    const onOk = () => {
      const axiosObj = axios.put(`${PRE_TEST_REPORTS_URL}/remove`, { courseIds: selectedRowKeys });
      axiosObj.then(() => {
        message.success('Remove student from pretest success');
        this.fetchPreTests();
      })
        .catch((error) => {
          showError(error);
        });
    };

    confirm({
      title: 'Do you want remove students from pre test schedule?',
      content: 'This action cannot be undone',
      onOk,
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  download = () => {
    axios.get(PRE_TEST_DOWNLOAD_URL, { responseType: 'blob', params: {
      searchText: this.state.searchText,
      dateRange: this.state.dateRange,
    } })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'pretest.xlsx');
        document.body.appendChild(link);
        link.click();
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
    const { selectedRowKeys } = this.state;
    const { rowKeysChanged } = this;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (rowKeys, selectedRows) => {
        rowKeysChanged(rowKeys, selectedRows);
      },
    };
    return (
      <div>
        <Row gutter={10}>
          <Col span={6}>
            <RangePicker
              value={this.state.dateRange}
              onChange={(date) => {
                this.onRangeChange(date);
              }}
            />
          </Col>
          <Col span={7}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Name or SID"
              maxLength="50"
            />
          </Col>
          <Col span={10}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={() => this.fetchPreTests()}
                style={{ marginRight: 5 }}
              />
              <Button
                type="danger"
                shape="circle"
                icon="delete"
                onClick={() => this.confirmDelete()}
              />
              <Button
                shape="circle"
                icon="download"
                onClick={() => this.download({})}
                style={{ marginLeft: 15 }}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.preTests}
              style={{ marginTop: 20, width: '100%' }}
              rowKey="id"
              loading={this.state.loading}
              pagination={{
                total: this.state.count,
                current: this.state.currentPage,
                pageSize: this.state.pageSize,
              }}
              onChange={this.pageChanged}
              rowSelection={rowSelection}
              size="small"
            >
              <Column
                title="Title"
                dataIndex="title"
                key="title"
              />
              <Column
                title="Pre Test Date"
                dataIndex="preTestDate"
                key="preTestDate"
                render={(text, record) => (
                  <span>
                    {moment(text).format('DD/MM/YYYY')}
                  </span>
                )}
              />
              <Column
                title="Old SID"
                dataIndex="Student.oldSid"
              />
              <Column
                title="New SID"
                dataIndex="Student.newSid"
              />
              <Column
                title="Name"
                dataIndex="Student.name"
              />
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default PreTestList;
