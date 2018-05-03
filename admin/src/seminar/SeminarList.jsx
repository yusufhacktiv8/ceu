import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, DatePicker, Row, Col, message, Popconfirm } from 'antd';
import moment from 'moment';
import showError from '../utils/ShowError';
import SeminarWindow from './SeminarWindow';

const SEMINARS_URL = `${process.env.REACT_APP_SERVER_URL}/api/seminars`;
const Column = Table.Column;
const { RangePicker } = DatePicker;

class SeminarList extends Component {
  state = {
    searchText: '',
    seminar: {},
    seminars: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    seminarWindowVisible: false,
  }
  componentDidMount() {
    this.fetchSeminars();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onRangeChange = (e) => {
    this.setState({
      hospitalDateRange: e,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchSeminars();
  }

  fetchSeminars() {
    this.setState({
      loading: true,
    });
    axios.get(SEMINARS_URL, { params: {
      searchText: this.state.searchText,
      dateRange: this.state.hospitalDateRange,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          seminars: response.data.rows,
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

  filterSeminars = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchSeminars(); });
  }

  deleteSeminar(seminar) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${SEMINARS_URL}/${seminar.id}`)
      .then(() => {
        message.success('Delete seminar success');
        this.fetchSeminars();
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
      seminar: record,
      seminarWindowVisible: true,
    }, () => {
      this.seminarWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      seminarWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchSeminars(); });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={6}>
            <RangePicker onChange={this.onRangeChange} />
          </Col>
          <Col span={6}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Name or SID"
              maxLength="50"
            />
          </Col>
          <Col span={12}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterSeminars}
                style={{ marginRight: 15 }}
              />
              <Button
                type="primary"
                shape="circle"
                icon="plus"
                onClick={() => this.openEditWindow({})}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.seminars}
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
                title="Code"
                dataIndex="code"
                key="code"
              />
              <Column
                title="Name"
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
                      title={`Are you sure delete seminar ${record.name}`}
                      onConfirm={() => this.deleteSeminar(record)}
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
          </Col>
        </Row>

        <SeminarWindow
          visible={this.state.seminarWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          seminar={this.state.seminar}
          ref={seminarWindow => (this.seminarWindow = seminarWindow)}
        />
      </div>
    );
  }
}

export default SeminarList;
