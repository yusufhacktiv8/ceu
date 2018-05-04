import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';
import PengampuWindow from './PengampuWindow';

const PENGAMPUS_URL = `${process.env.REACT_APP_SERVER_URL}/api/pengampus`;
const Column = Table.Column;

class PengampuList extends Component {
  state = {
    searchText: '',
    pengampu: {},
    pengampus: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    pengampuWindowVisible: false,
  }
  componentDidMount() {
    this.fetchPengampus();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchPengampus();
  }

  fetchPengampus() {
    this.setState({
      loading: true,
    });
    axios.get(PENGAMPUS_URL, { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          pengampus: response.data.rows,
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

  filterPengampus = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchPengampus(); });
  }

  deletePengampu(pengampu) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${PENGAMPUS_URL}/${pengampu.id}`)
      .then(() => {
        message.success('Delete pengampu success');
        this.fetchPengampus();
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
      pengampu: record,
      pengampuWindowVisible: true,
    }, () => {
      this.pengampuWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      pengampuWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchPengampus(); });
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
                onClick={this.filterPengampus}
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
              dataSource={this.state.pengampus}
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
                      title={`Are you sure delete pengampu ${record.name}`}
                      onConfirm={() => this.deletePengampu(record)}
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

        <PengampuWindow
          visible={this.state.pengampuWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          pengampu={this.state.pengampu}
          ref={pengampuWindow => (this.pengampuWindow = pengampuWindow)}
        />
      </div>
    );
  }
}

export default PengampuList;
