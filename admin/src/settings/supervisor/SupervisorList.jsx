import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';
import SupervisorWindow from './SupervisorWindow';

const SUPERVISORS_URL = `${process.env.REACT_APP_SERVER_URL}/api/supervisors`;
const Column = Table.Column;

class SupervisorList extends Component {
  state = {
    searchText: '',
    supervisor: {},
    supervisors: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    supervisorWindowVisible: false,
  }
  componentDidMount() {
    this.fetchSupervisors();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchSupervisors();
  }

  fetchSupervisors() {
    this.setState({
      loading: true,
    });
    axios.get(SUPERVISORS_URL, { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          supervisors: response.data.rows,
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

  filterSupervisors = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchSupervisors(); });
  }

  deleteSupervisor(supervisor) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${SUPERVISORS_URL}/${supervisor.id}`)
      .then(() => {
        message.success('Delete supervisor success');
        this.fetchSupervisors();
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
      supervisor: record,
      supervisorWindowVisible: true,
    }, () => {
      this.supervisorWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      supervisorWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchSupervisors(); });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={8}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Name or SID"
              maxLength="50"
            />
          </Col>
          <Col span={16}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterSupervisors}
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
              dataSource={this.state.supervisors}
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
                render={(columnText, record) => {
                  const reg = new RegExp(this.state.searchText, 'gi');
                  const match = columnText.match(reg);
                  return (
                    <span key={record.code}>
                      {columnText.split(reg).map((text, i) => (
                        i > 0 ? [<span key={record.code} style={{ color: '#F50' }}>{match[0]}</span>, text] : text
                      ))}
                    </span>
                  );
                }}
              />
              <Column
                title="Name"
                dataIndex="name"
                key="name"
                render={(columnText, record) => {
                  const reg = new RegExp(this.state.searchText, 'gi');
                  const match = columnText.match(reg);
                  return (
                    <span key={record.code}>
                      {columnText.split(reg).map((text, i) => (
                        i > 0 ? [<span key={record.code} style={{ color: '#F50' }}>{match[0]}</span>, text] : text
                      ))}
                    </span>
                  );
                }}
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
                      title={`Are you sure delete supervisor ${record.name}`}
                      onConfirm={() => this.deleteSupervisor(record)}
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

        <SupervisorWindow
          visible={this.state.supervisorWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          supervisor={this.state.supervisor}
          ref={supervisorWindow => (this.supervisorWindow = supervisorWindow)}
        />
      </div>
    );
  }
}

export default SupervisorList;
