import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';
import DepartmentWindow from './DepartmentWindow';

const DEPARTMENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/departments`;
const Column = Table.Column;

class DepartmentList extends Component {
  state = {
    searchText: '',
    department: {},
    departments: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    departmentWindowVisible: false,
  }
  componentDidMount() {
    this.fetchDepartments();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.setState({
      loading: true,
    });
    axios.get(DEPARTMENTS_URL, { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          departments: response.data.rows,
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

  filterDepartments = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchDepartments(); });
  }

  deleteDepartment(department) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${DEPARTMENTS_URL}/${department.id}`)
      .then(() => {
        message.success('Delete department success');
        this.fetchDepartments();
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
      department: record,
      departmentWindowVisible: true,
    }, () => {
      this.departmentWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      departmentWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchDepartments(); });
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
                onClick={this.filterDepartments}
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
              dataSource={this.state.departments}
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
                title="Duration (Weeks)"
                dataIndex="duration"
                key="duration"
              />
              <Column
                title="Color"
                dataIndex="color"
                key="color"
                render={(text, record) => (
                  <div
                    style={{
                      width: 35,
                      height: 35,
                      borderRadius: '50%',
                      backgroundColor: record.color }}
                  />
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
                      title={`Are you sure delete department ${record.name}`}
                      onConfirm={() => this.deleteDepartment(record)}
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

        <DepartmentWindow
          visible={this.state.departmentWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          department={this.state.department}
          ref={departmentWindow => (this.departmentWindow = departmentWindow)}
        />
      </div>
    );
  }
}

export default DepartmentList;
