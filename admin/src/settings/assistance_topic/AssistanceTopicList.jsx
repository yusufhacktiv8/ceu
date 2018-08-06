import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Checkbox, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';
import AssistanceTopicWindow from './AssistanceTopicWindow';
import DepartmentSelect from '../../settings/department/DepartmentSelect';

const ASSISTANCE_TOPICS_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistancetopics`;
const Column = Table.Column;

class AssistanceTopicList extends Component {
  state = {
    searchText: '',
    assistanceTopic: {},
    assistanceTopics: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    assistanceTopicWindowVisible: false,
  }
  componentDidMount() {
    this.fetchAssistanceTopics();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onDepartmentChange = (e) => {
    this.setState({
      selectedDepartmentId: e,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchAssistanceTopics();
  }

  fetchAssistanceTopics() {
    this.setState({
      loading: true,
    });
    axios.get(ASSISTANCE_TOPICS_URL, { params: {
      searchText: this.state.searchText,
      searchDepartment: this.state.selectedDepartmentId,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          assistanceTopics: response.data.rows,
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

  filterAssistanceTopics = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchAssistanceTopics(); });
  }

  deleteAssistanceTopic(assistanceTopic) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${ASSISTANCE_TOPICS_URL}/${assistanceTopic.id}`)
      .then(() => {
        message.success('Delete seminar type success');
        this.fetchAssistanceTopics();
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
      assistanceTopic: record,
      assistanceTopicWindowVisible: true,
    }, () => {
      this.assistanceTopicWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      assistanceTopicWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchAssistanceTopics(); });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={8}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Code or Name"
              maxLength="50"
            />
          </Col>
          <Col span={8}>
            <DepartmentSelect
              level={-1}
              onChange={this.onDepartmentChange}
            />
          </Col>
          <Col span={8}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterAssistanceTopics}
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
              dataSource={this.state.assistanceTopics}
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
                title="Department"
                dataIndex="Department.name"
              />
              <Column
                title="Active"
                dataIndex="active"
                render={(text, record) => (
                  <span>
                    <Checkbox checked={record.active} />
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
                      title={`Are you sure delete seminar type ${record.name}`}
                      onConfirm={() => this.deleteAssistanceTopic(record)}
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

        <AssistanceTopicWindow
          visible={this.state.assistanceTopicWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          assistanceTopic={this.state.assistanceTopic}
          ref={assistanceTopicWindow => (this.assistanceTopicWindow = assistanceTopicWindow)}
        />
      </div>
    );
  }
}

export default AssistanceTopicList;
