import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Input, Table, Button, DatePicker, Row, Col } from 'antd';
import showError from '../../utils/ShowError';
import InitiateExportWindow from './InitiateExportWindow';

const { RangePicker } = DatePicker;

const INITIATES_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/initiatecourses`;
const Column = Table.Column;

class InitiateList extends Component {
  state = {
    searchText: '',
    courses: [],
    selectedRowKeys: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    exportWindowVisible: false,
  }
  componentDidMount() {
    this.fetchCourses();
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
    this.fetchCourses();
  }

  fetchCourses() {
    this.setState({
      loading: true,
    });
    axios.get(INITIATES_URL, { params: {
      searchText: this.state.searchText,
      dateRange: this.state.dateRange,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          courses: response.data.rows,
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

  filterCostUnits = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchCourses(); });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchCourses(); });
  }

  rowKeysChanged = (rowKeys) => {
    this.setState({
      selectedRowKeys: rowKeys,
    });
  }

  openExportWindow = () => {
    this.setState({
      exportWindowVisible: true,
    }, () => {
      this.exportWindow.resetFields();
    });
  }

  closeExportWindow = () => {
    this.setState({
      exportWindowVisible: false,
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
                onClick={() => this.fetchCourses()}
                style={{ marginRight: 5 }}
              />
              <Button
                shape="circle"
                icon="export"
                onClick={() => this.openExportWindow()}
                style={{ backgroundColor: '#50C14E', color: '#fff' }}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.courses}
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
                title="Plan Start Date"
                dataIndex="planStartDate"
                key="planStartDate"
                render={text => (
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
        <InitiateExportWindow
          visible={this.state.exportWindowVisible}
          courseIds={this.state.selectedRowKeys}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeExportWindow}
          onClose={this.closeExportWindow}
          ref={exportWindow => (this.exportWindow = exportWindow)}
        />
      </div>
    );
  }
}

export default InitiateList;
