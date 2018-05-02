import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Checkbox, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';
import SeminarTypeWindow from './SeminarTypeWindow';
import DepartmentSelect from '../../settings/department/DepartmentSelect';

const SEMINAR_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/seminartypes`;
const Column = Table.Column;

class SeminarTypeList extends Component {
  state = {
    searchText: '',
    seminarType: {},
    seminarTypes: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    seminarTypeWindowVisible: false,
  }
  componentDidMount() {
    this.fetchSeminarTypes();
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
    this.fetchSeminarTypes();
  }

  fetchSeminarTypes() {
    this.setState({
      loading: true,
    });
    axios.get(SEMINAR_TYPES_URL, { params: {
      searchText: this.state.searchText,
      searchDepartment: this.state.selectedDepartmentId,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          seminarTypes: response.data.rows,
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

  filterSeminarTypes = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchSeminarTypes(); });
  }

  deleteSeminarType(seminarType) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${SEMINAR_TYPES_URL}/${seminarType.id}`)
      .then(() => {
        message.success('Delete seminar type success');
        this.fetchSeminarTypes();
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
      seminarType: record,
      seminarTypeWindowVisible: true,
    }, () => {
      this.seminarTypeWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      seminarTypeWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchSeminarTypes(); });
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
                onClick={this.filterSeminarTypes}
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
              dataSource={this.state.seminarTypes}
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
                      onConfirm={() => this.deleteSeminarType(record)}
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

        <SeminarTypeWindow
          visible={this.state.seminarTypeWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          seminarType={this.state.seminarType}
          ref={seminarTypeWindow => (this.seminarTypeWindow = seminarTypeWindow)}
        />
      </div>
    );
  }
}

export default SeminarTypeList;
