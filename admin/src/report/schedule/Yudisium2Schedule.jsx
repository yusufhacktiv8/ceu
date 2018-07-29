import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Input, Icon, Table, Button, DatePicker, Row, Col, message, Modal } from 'antd';
import showError from '../../utils/ShowError';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

const YUDISIUM_SCHEDULE_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/yudisium2schedule`;
const Column = Table.Column;

class Yudisium2Schedule extends Component {
  state = {
    searchText: '',
    yudisiums: [],
    selectedRowKeys: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    exportWindowVisible: false,
  }
  componentDidMount() {
    this.fetchYudisiumSchedule();
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
    this.fetchYudisiumSchedule();
  }

  fetchYudisiumSchedule() {
    this.setState({
      loading: true,
    });
    axios.get(YUDISIUM_SCHEDULE_URL, { params: {
      searchText: this.state.searchText,
      dateRange: this.state.dateRange,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          yudisiums: response.data.rows,
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
    }, () => { this.fetchYudisiumSchedule(); });
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
      const axiosObj = axios.put(YUDISIUM_SCHEDULE_URL, { yudisiumIds: selectedRowKeys });
      axiosObj.then(() => {
        message.success('Remove student from yudisium success');
        this.fetchYudisiumSchedule();
      })
        .catch((error) => {
          showError(error);
        });
    };

    confirm({
      title: 'Do you want remove students from yudisium schedule?',
      content: 'This action cannot be undone',
      onOk,
      onCancel() {
        console.log('Cancel');
      },
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
                onClick={() => this.fetchYudisiumSchedule()}
                style={{ marginRight: 5 }}
              />
              <Button
                type="danger"
                shape="circle"
                icon="delete"
                onClick={() => this.confirmDelete()}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.yudisiums}
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
              <Column
                title="Yudisium Date"
                dataIndex="yudisiumDate"
                key="yudisiumDate"
                render={(text, record) => (
                  <span>
                    {moment(text).format('DD/MM/YYYY')}
                  </span>
                )}
              />
              <Column
                title="Completed"
                dataIndex="completed"
                key="completed"
                render={(text, record) => (
                  <span>
                    {record.completed ? <Icon type="check-circle" style={{ color: 'green', fontSize: 20 }} /> : null}
                  </span>
                )}
              />
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Yudisium2Schedule;
