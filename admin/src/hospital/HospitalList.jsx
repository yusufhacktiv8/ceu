import React, { Component } from 'react';
import axios from 'axios';
import { Button, Input, Row, Col, Menu, message } from 'antd';
import showError from '../utils/ShowError';
import HospitalWindow from './HospitalWindow';
import HospitalTable from './HospitalTable';
import DepartmentSelect from '../settings/department/DepartmentSelect';

const HOSPITALS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitalselect/hospitalschedules`;

class HospitalList extends Component {
  state = {
    searchText: '',
    hospitalType: 1,
    hospital: {},
    hospitals: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
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
      hospitalType: this.state.hospitalType,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          hospitals: response.data.rows,
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

  filterHospitals = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchHospitals(); });
  }

  deleteHospital(hospital) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${HOSPITALS_URL}/${hospital.id}`)
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

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchHospitals(); });
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
          <Col span={8}>
            <DepartmentSelect level={-1} />
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
            <HospitalTable
              hospitals={this.state.hospitals}
              loading={this.state.loading}
              count={this.state.count}
              currentPage={this.state.currentPage}
              pageSize={this.state.pageSize}
              onChange={this.pageChanged}
              openEditWindow={this.openEditWindow}
              deleteHospital={this.deleteHospital}
            />
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
      </div>
    );
  }
}

export default HospitalList;
