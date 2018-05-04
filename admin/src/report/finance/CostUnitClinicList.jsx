import React, { Component } from 'react';
import axios from 'axios';
import numeral from 'numeral';
import { Table, Button, DatePicker, Row, Col } from 'antd';
import showError from '../../utils/ShowError';
import HospitalSelect from '../../hospital/HospitalSelect';

const { RangePicker } = DatePicker;

const COST_UNIT_CLINICS_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/costunitsclinic`;
const Column = Table.Column;

class CostUnitClinicList extends Component {
  state = {
    costUnit: {},
    costUnits: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    costUnitWindowVisible: false,
    hospital: null,
  }
  componentDidMount() {
    this.fetchCostUnitClinics();
  }

  onRangeChange = (e) => {
    this.setState({
      dateRange: e,
    });
  }

  fetchCostUnitClinics() {
    this.setState({
      loading: true,
    });
    axios.get(COST_UNIT_CLINICS_URL, { params: {
      hospital: this.state.hospital,
      dateRange: this.state.dateRange,
    } })
      .then((response) => {
        this.setState({
          costUnits: response.data,
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

  filterCostUnitClinics = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchCostUnitClinics(); });
  }

  openEditWindow = (record) => {
    this.setState({
      costUnit: record,
      costUnitWindowVisible: true,
    }, () => {
      this.costUnitWindow.resetFields();
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchCostUnitClinics(); });
  }

  hospitalChanged = (value) => {
    this.setState({
      hospital: value,
    });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={6}>
            <RangePicker
              value={this.state.dateRange}
              onChange={(date) => {
                this.onRangeChange(date);
              }}
            />
          </Col>
          <Col span={7}>
            <HospitalSelect
              hospitalType={2}
              value={this.state.hospital}
              onChange={this.hospitalChanged}
              style={{ width: '100%', marginBottom: 5 }}
            />
          </Col>
          <Col span={10}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={() => this.fetchCostUnitClinics()}
                style={{ marginRight: 15 }}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.costUnits}
              style={{ marginTop: 20, width: '100%' }}
              rowKey="id"
              loading={this.state.loading}
              pagination={{
                total: this.state.count,
                current: this.state.currentPage,
                pageSize: this.state.pageSize,
              }}
              onChange={this.pageChanged}
              size="small"
              scroll={{ x: 1350 }}
            >
              <Column
                title="Department"
                dataIndex="Department.name"
                fixed="left"
                width={100}
              />
              <Column
                title="Name"
                dataIndex="Student.name"
                fixed="left"
                width={100}
              />
              <Column
                title="Duration"
                dataIndex="courseDuration"
                fixed="left"
                width={100}
              />
              <Column
                title="NST. Fee/Week"
                dataIndex="fee1"
                width={100}
                render={text => (numeral(text).format('0,0.00'))}
              />
              <Column
                title="DIR (20rb)"
                dataIndex="fee2"
                width={100}
                render={text => (numeral(text).format('0,0.00'))}
              />
              <Column
                title="BKD (20rb)"
                dataIndex="fee3"
                width={100}
                render={text => (numeral(text).format('0,0.00'))}
              />
              <Column
                title="KDI (5rb)"
                dataIndex="fee4"
                width={100}
                render={text => (numeral(text).format('0,0.00'))}
              />
              <Column
                title="DPK"
                dataIndex="dpk.name"
                width={100}
              />
              <Column
                title="DPK (50rb)"
                dataIndex="fee6"
                width={100}
                render={text => (numeral(text).format('0,0.00'))}
              />
              <Column
                title="Total"
                dataIndex="total"
                fixed="right"
                width={100}
                render={text => (numeral(text).format('0,0.00'))}
              />
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default CostUnitClinicList;
