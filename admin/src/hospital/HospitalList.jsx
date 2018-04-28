import React, { Component } from 'react';
import axios from 'axios';
import { Button, Input, Row, Col, Menu, Table, Badge, Popconfirm, message } from 'antd';
import showError from '../utils/ShowError';
import HospitalWindow from './HospitalWindow';
import DepartmentSelect from '../settings/department/DepartmentSelect';
import HospitalStudentWindow from './HospitalStudentWindow';

const Column = Table.Column;

const HOSPITALS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitalselect/hospitalschedules`;
const HOSPITAL_DELETE_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitals`;

class HospitalList extends Component {
  state = {
    searchText: '',
    hospital: {},
    hospitals: [],
    loading: false,
    hospitalWindowVisible: false,
    activeKey: '1',
  }
  componentDidMount() {
    this.fetchHospitals();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onTabsChange = (e) => {
    const activeKey = e.key;
    this.setState({ activeKey });
  }

  onDepartmentChange = (e) => {
    this.setState({
      selectedDepartmentId: e,
    }, () => {
      this.fetchHospitals();
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchHospitals();
  }

  fetchHospitals() {
    this.setState({
      loading: true,
    });
    axios.get(HOSPITALS_URL, { params: {
      searchText: this.state.searchText,
      hospitalType: this.state.activeKey,
    } })
      .then((response) => {
        this.setState({
          hospitals: response.data,
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

  filterHospitals = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchHospitals(); });
  }

  deleteHospital(hospital) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${HOSPITAL_DELETE_URL}/${hospital.id}`)
      .then(() => {
        message.success('Delete hospital success');
        this.fetchHospitals();
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
      hospital: record,
      hospitalWindowVisible: true,
    }, () => {
      this.hospitalWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      hospitalWindowVisible: false,
    });
  }

  openDepartmentsPage = (record) => {
    this.props.history.push(`/hospitals/${record.id}/departments`);
  }

  openHospitalStudentWindow = (record) => {
    this.setState({
      selectedHospitalId: record.id,
      hospitalStudentWindowVisible: true,
    }, () => {
      this.hospitalStudentWindow.fetchHospitalStudents();
    });
  }

  closeHospitalStudentWindow = () => {
    this.setState({
      hospitalStudentWindowVisible: false,
    });
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
            <DepartmentSelect level={-1} onChange={this.onDepartmentChange} />
          </Col>
          <Col span={8}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterHospitals}
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
            <Menu
              mode="horizontal"
              selectedKeys={[this.state.activeKey]}
              onClick={this.onTabsChange}
              style={{ marginBottom: 10 }}
            >
              <Menu.Item key="1">
                Hospitals
              </Menu.Item>
              <Menu.Item key="2">
                Clinics
              </Menu.Item>
            </Menu>

            <Table
              dataSource={this.state.hospitals.filter(hospital =>
                String(hospital.hospitalType) === this.state.activeKey)}
              rowKey="id"
              loading={this.state.loading}
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
                title="Quota"
                render={(columnText, record) =>
                  (
                    <Badge
                      count={record.departmentQuota}
                      overflowCount={1000}
                      style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
                      showZero
                    />
                  )
                }
              />
              <Column
                title="Student Count"
                render={(columnText, record) => {
                  const departmentQuota = parseInt(record.departmentQuota, 10);
                  const studentsInDepartmentCount = parseInt(record.studentsInDepartmentCount, 10);
                  let badge = (
                    <Badge
                      count={record.studentsInDepartmentCount}
                      overflowCount={1000}
                      style={{ backgroundColor: '#87d068', cursor: 'pointer' }}
                      showZero
                      onClick={() => { this.openHospitalStudentWindow(record); }}
                    />
                  );
                  if (studentsInDepartmentCount > departmentQuota) {
                    badge = (
                      <Badge
                        count={record.studentsInDepartmentCount}
                        overflowCount={1000}
                        style={{ cursor: 'pointer' }}
                        showZero
                        onClick={() => { this.openHospitalStudentWindow(record); }}
                      />
                    );
                  }
                  return badge;
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
                    <Button
                      icon="profile"
                      size="small"
                      onClick={() => this.openDepartmentsPage(record)}
                      style={{ marginRight: 5 }}
                    />
                    <Popconfirm
                      title={`Are you sure delete hospital / clinic ${record.name}`}
                      onConfirm={() => this.deleteHospital(record)}
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

        <HospitalWindow
          visible={this.state.hospitalWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          hospital={this.state.hospital}
          ref={hospitalWindow => (this.hospitalWindow = hospitalWindow)}
        />
        <HospitalStudentWindow
          visible={this.state.hospitalStudentWindowVisible}
          onCancel={this.closeHospitalStudentWindow}
          onClose={this.closeHospitalStudentWindow}
          hospitalId={this.state.selectedHospitalId}
          departmentId={this.state.selectedDepartmentId}
          ref={hospitalStudentWindow => (this.hospitalStudentWindow = hospitalStudentWindow)}
        />
      </div>
    );
  }
}

export default HospitalList;
