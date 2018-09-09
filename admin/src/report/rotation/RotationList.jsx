import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';

const ROTATIONS_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/rotations`;
const Column = Table.Column;

class RotationList extends Component {
  state = {
    searchText: '',
    rotation: {},
    rotations: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    rotationWindowVisible: false,
  }
  componentDidMount() {
    this.fetchRotations();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchRotations();
  }

  fetchRotations() {
    this.setState({
      loading: true,
    });
    axios.get(ROTATIONS_URL, { params: {
      searchText: this.state.searchText,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          rotations: response.data.rows,
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

  filterRotations = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchRotations(); });
  }

  deleteRotation(rotation) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${ROTATIONS_URL}/${rotation.id}`)
      .then(() => {
        message.success('Delete rotation success');
        this.fetchRotations();
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
      rotation: record,
      rotationWindowVisible: true,
    }, () => {
      this.rotationWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      rotationWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchRotations(); });
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
                onClick={this.filterRotations}
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
              dataSource={this.state.rotations}
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
                title="Name"
                dataIndex="Student.name"
              />
              <Column
                title="Old SID"
                dataIndex="Student.oldSid"
              />
              <Column
                title="New SID"
                dataIndex="Student.newSid"
              />
              <Column
                title="Department"
                dataIndex="Department.name"
              />
              <Column
                title="Hospital"
                dataIndex="hospital1.name"
              />
              <Column
                title="Clinic"
                dataIndex="clinic.name"
              />
              <Column
                title="Tutor"
                dataIndex="adviser.name"
              />
              <Column
                title="Examiner"
                dataIndex="examiner.name"
              />
              <Column
                title="Score"
                dataIndex="score"
                key="score"
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
                      title={`Are you sure delete rotation ${record.name}`}
                      onConfirm={() => this.deleteRotation(record)}
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
      </div>
    );
  }
}

export default RotationList;
