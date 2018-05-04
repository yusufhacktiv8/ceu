import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Checkbox, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';
import SglTypeWindow from './SglTypeWindow';
import DepartmentSelect from '../../settings/department/DepartmentSelect';

const SGL_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/sgltypes`;
const Column = Table.Column;

class SglTypeList extends Component {
  state = {
    searchText: '',
    sglType: {},
    sglTypes: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    sglTypeWindowVisible: false,
  }
  componentDidMount() {
    this.fetchSglTypes();
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
    this.fetchSglTypes();
  }

  fetchSglTypes() {
    this.setState({
      loading: true,
    });
    axios.get(SGL_TYPES_URL, { params: {
      searchText: this.state.searchText,
      searchDepartment: this.state.selectedDepartmentId,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          sglTypes: response.data.rows,
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

  filterSglTypes = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchSglTypes(); });
  }

  deleteSglType(sglType) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${SGL_TYPES_URL}/${sglType.id}`)
      .then(() => {
        message.success('Delete sgl type success');
        this.fetchSglTypes();
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
      sglType: record,
      sglTypeWindowVisible: true,
    }, () => {
      this.sglTypeWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      sglTypeWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchSglTypes(); });
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
                onClick={this.filterSglTypes}
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
              dataSource={this.state.sglTypes}
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
                      title={`Are you sure delete sgl type ${record.name}`}
                      onConfirm={() => this.deleteSglType(record)}
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

        <SglTypeWindow
          visible={this.state.sglTypeWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          sglType={this.state.sglType}
          ref={sglTypeWindow => (this.sglTypeWindow = sglTypeWindow)}
        />
      </div>
    );
  }
}

export default SglTypeList;
