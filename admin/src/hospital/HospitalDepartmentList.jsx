import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import showError from '../utils/ShowError';
import HospitalDepartmentWindow from './HospitalDepartmentWindow';

const HOSPITALS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitals`;
const HOSPITAL_DEPARTMENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitaldepartments`;
const getHospitalDepartmentUrl = hospitalId => `${HOSPITALS_URL}/${hospitalId}/departments`;
const Column = Table.Column;

class HospitalDepartmentList extends Component {
  state = {
    searchText: '',
    hospitalDepartment: {},
    hospitalDepartments: [],
    loading: false,
    hospitalDepartmentWindowVisible: false,
  }
  componentDidMount() {
    this.fetchHospitalDepartments();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchHospitalDepartments();
  }

  fetchHospitalDepartments() {
    const { match } = this.props;
    const { hospitalId } = match.params;
    this.setState({
      loading: true,
    });
    axios.get(getHospitalDepartmentUrl(hospitalId), { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          hospitalDepartments: response.data,
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

  filterHospitalDepartments = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchHospitalDepartments(); });
  }

  deleteHospitalDepartment(hospitalDepartment) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${HOSPITAL_DEPARTMENTS_URL}/${hospitalDepartment.id}`)
      .then(() => {
        message.success('Delete hospitalDepartment success');
        this.fetchHospitalDepartments();
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
      hospitalDepartment: record,
      hospitalDepartmentWindowVisible: true,
    }, () => {
      this.hospitalDepartmentWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      hospitalDepartmentWindowVisible: false,
    });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={8}>
            <span>
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
              dataSource={this.state.hospitalDepartments}
              style={{ marginTop: 20 }}
              rowKey="id"
              loading={this.state.loading}
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
                      title={`Are you sure delete hospitalDepartment ${record.name}`}
                      onConfirm={() => this.deleteHospitalDepartment(record)}
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

        <HospitalDepartmentWindow
          visible={this.state.hospitalDepartmentWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          hospitalDepartment={this.state.hospitalDepartment}
          ref={hospitalDepartmentWindow => (this.hospitalDepartmentWindow = hospitalDepartmentWindow)}
        />
      </div>
    );
  }
}

export default HospitalDepartmentList;
