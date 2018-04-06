import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import showError from '../utils/ShowError';
import RoleWindow from './RoleWindow';

const ROLES_URL = `${process.env.REACT_APP_SERVER_URL}/api/roles`;
const Column = Table.Column;

class RoleList extends Component {
  state = {
    searchText: '',
    role: {},
    roles: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    roleWindowVisible: false,
  }
  componentDidMount() {
    this.getRoles();
  }

  getRoles() {
    this.setState({
      loading: true,
    });
    axios.get(ROLES_URL, { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          roles: response.data.rows,
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

  filterRoles() {
    this.setState({
      currentPage: 1,
    }, () => { this.getRoles(); });
  }

  saveRole(role) {
    const hide = message.loading('Action in progress..', 0);
    const roleId = this.state.role.id;
    const axiosObj = roleId ? axios.put(`${ROLES_URL}/${roleId}`, role) : axios.post(ROLES_URL, role);
    axiosObj.then(() => {
      this.handleCancel();
      this.getRoles();
      message.success('Save role success');
    })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
      });
  }

  deleteRole(role) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${ROLES_URL}/${role.id}`)
      .then(() => {
        hide();
        this.getRoles();
        message.success('Delete role success');
      })
      .catch((error) => {
        hide();
        showError(error);
      });
  }

  openEditWindow(record) {
    this.setState({
      role: record,
      roleWindowVisible: true,
    }, () => {
      this.roleWindow.resetFields();
    });
  }

  handleCancel() {
    this.setState({
      roleWindowVisible: false,
    });
  }

  handleSave() {
    this.roleWindow.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.saveRole(values);
      this.setState({ roleWindowVisible: false });
    });
  }

  pageChanged(page) {
    this.setState({
      currentPage: page,
    }, () => { this.getRoles(); });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={8}>
            <Input
              value={this.state.searchText}
              onChange={(e) => {
                this.setState({
                  searchText: e.target.value,
                });
              }}
              placeholder="Name or SID"
            />
          </Col>
          <Col span={16}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={() => this.filterRoles()}
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
              dataSource={this.state.roles}
              style={{ marginTop: 20 }}
              rowKey="id"
              loading={this.state.loading}
              pagination={{
                total: this.state.count,
                current: this.state.currentPage,
                pageSize: this.state.pageSize,
              }}
              onChange={pagination => this.pageChanged(pagination.current)}
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
                      title={`Are you sure delete role ${record.name}`}
                      onConfirm={() => this.deleteRole(record)}
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

        <RoleWindow
          visible={this.state.roleWindowVisible}
          onSave={() => this.handleSave()}
          onCancel={() => this.handleCancel()}
          role={this.state.role}
          ref={roleWindow => (this.roleWindow = roleWindow)}
        />
      </div>
    );
  }
}

export default RoleList;
