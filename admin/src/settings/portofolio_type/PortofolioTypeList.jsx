import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Checkbox, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';
import PortofolioTypeWindow from './PortofolioTypeWindow';
import DepartmentSelect from '../../settings/department/DepartmentSelect';

const PORTOFOLIO_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/portofoliotypes`;
const Column = Table.Column;

class PortofolioTypeList extends Component {
  state = {
    searchText: '',
    portofolioType: {},
    portofolioTypes: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    portofolioTypeWindowVisible: false,
  }
  componentDidMount() {
    this.fetchPortofolioTypes();
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
    this.fetchPortofolioTypes();
  }

  fetchPortofolioTypes() {
    this.setState({
      loading: true,
    });
    axios.get(PORTOFOLIO_TYPES_URL, { params: {
      searchText: this.state.searchText,
      searchDepartment: this.state.selectedDepartmentId,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          portofolioTypes: response.data.rows,
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

  filterPortofolioTypes = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchPortofolioTypes(); });
  }

  deletePortofolioType(portofolioType) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${PORTOFOLIO_TYPES_URL}/${portofolioType.id}`)
      .then(() => {
        message.success('Delete portofolio type success');
        this.fetchPortofolioTypes();
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
      portofolioType: record,
      portofolioTypeWindowVisible: true,
    }, () => {
      this.portofolioTypeWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      portofolioTypeWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchPortofolioTypes(); });
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
                onClick={this.filterPortofolioTypes}
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
              dataSource={this.state.portofolioTypes}
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
                      title={`Are you sure delete portofolio type ${record.name}`}
                      onConfirm={() => this.deletePortofolioType(record)}
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

        <PortofolioTypeWindow
          visible={this.state.portofolioTypeWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          portofolioType={this.state.portofolioType}
          ref={portofolioTypeWindow => (this.portofolioTypeWindow = portofolioTypeWindow)}
        />
      </div>
    );
  }
}

export default PortofolioTypeList;
