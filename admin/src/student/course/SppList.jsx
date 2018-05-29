import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';
import SppWindow from './SppWindow';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const SPPS_URL = `${process.env.REACT_APP_SERVER_URL}/api/spps`;
const getSppsUrl = studentId => `${STUDENTS_URL}/${studentId}/spps`;
const Column = Table.Column;

class SppList extends Component {
  state = {
    searchText: '',
    spp: {},
    spps: [],
    loading: false,
    sppWindowVisible: false,
  }
  componentDidMount() {
    this.fetchSpps();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchSpps();
  }

  fetchSpps() {
    const { studentId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getSppsUrl(studentId), { params: {} })
      .then((response) => {
        this.setState({
          spps: response.data,
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

  filterSpps = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchSpps(); });
  }

  deleteSpp(spp) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${SPPS_URL}/${spp.id}`)
      .then(() => {
        message.success('Delete spp success');
        this.fetchSpps();
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
      spp: record,
      sppWindowVisible: true,
    }, () => {
      this.sppWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      sppWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchSpps(); });
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
                onClick={this.filterSpps}
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
              dataSource={this.state.spps}
              style={{ marginTop: 20 }}
              rowKey="id"
              loading={this.state.loading}
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
                      title={`Are you sure delete spp ${record.name}`}
                      onConfirm={() => this.deleteSpp(record)}
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

        <SppWindow
          visible={this.state.sppWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          spp={this.state.spp}
          ref={sppWindow => (this.sppWindow = sppWindow)}
        />
      </div>
    );
  }
}

export default SppList;
