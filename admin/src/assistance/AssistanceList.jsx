import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, DatePicker, Row, Col, message, Popconfirm } from 'antd';
import moment from 'moment';
import showError from '../utils/ShowError';
import AssistanceWindow from './AssistanceWindow';

const ASSISTANCES_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistances`;
const Column = Table.Column;
const { RangePicker } = DatePicker;

const getInitialDateRange = () => {
  const date = new Date();
  const y = date.getFullYear();
  const m = date.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);

  return [moment(firstDay), moment(lastDay)];
};

class AssistanceList extends Component {
  state = {
    searchText: '',
    assistance: {},
    assistances: [],
    hospitalDateRange: getInitialDateRange(),
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    assistanceWindowVisible: false,
  }
  componentDidMount() {
    this.fetchAssistances();
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
    this.fetchAssistances();
  }

  fetchAssistances() {
    this.setState({
      loading: true,
    });
    axios.get(ASSISTANCES_URL, { params: {
      searchText: this.state.searchText,
      dateRange: this.state.hospitalDateRange,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          assistances: response.data.rows,
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

  filterAssistances = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchAssistances(); });
  }

  deleteAssistance(assistance) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${ASSISTANCES_URL}/${assistance.id}`)
      .then(() => {
        message.success('Delete assistance success');
        this.fetchAssistances();
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
      assistance: record,
      assistanceWindowVisible: true,
    }, () => {
      this.assistanceWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      assistanceWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchAssistances(); });
  }

  openDetailsPage = (record) => {
    this.props.history.push(`/assistances/${record.id}/participants`);
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={6}>
            <RangePicker value={this.state.hospitalDateRange} onChange={this.onRangeChange} />
          </Col>
          <Col span={6}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Code or Name"
              maxLength="50"
            />
          </Col>
          <Col span={12}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterAssistances}
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
              dataSource={this.state.assistances}
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
                    <Button
                      icon="bars"
                      size="small"
                      onClick={() => this.openDetailsPage(record)}
                      style={{ marginRight: 5 }}
                    />
                    <Popconfirm
                      title={`Are you sure delete assistance ${record.name}`}
                      onConfirm={() => this.deleteAssistance(record)}
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

        <AssistanceWindow
          visible={this.state.assistanceWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          assistance={this.state.assistance}
          ref={assistanceWindow => (this.assistanceWindow = assistanceWindow)}
        />
      </div>
    );
  }
}

export default AssistanceList;
