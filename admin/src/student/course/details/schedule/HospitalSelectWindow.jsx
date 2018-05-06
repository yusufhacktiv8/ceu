import React, { Component } from 'react';
import { Modal, Form, DatePicker, Row, Col, Button, Table, Badge, message } from 'antd';
import axios from 'axios';
import showError from '../../../../utils/ShowError';

const HOSPITAL_SCHEDULES_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitalselect`;

const { RangePicker } = DatePicker;
const { Column } = Table;

class HospitalSelectWindow extends Component {
  state = {
    saving: false,
    loading: false,
    dateRange: [],
    hospitalSchedules: [],
    selectedRowKeys: [],
    selectedRows: [],
  }

  onSave = () => {
    const { selectedRows } = this.state;
    if (selectedRows.length > 0) {
      this.props.onSelect(selectedRows[0]);
    }
  }

  fetchHospitalSchedules = () => {
    const dateRange = this.state.dateRange;
    if (dateRange.length === 0) {
      message.error('Please select date range');
      return;
    }
    const department = this.props.departmentId;
    const student = this.props.studentId;
    const startDate = dateRange[0];
    const endDate = dateRange[1];
    const hospitalType = this.props.hospitalType;
    const search = {
      department,
      student,
      startDate,
      endDate,
      hospitalType,
    };
    this.setState({
      loading: true,
    });
    axios.get(HOSPITAL_SCHEDULES_URL, { params: { ...search } })
      .then((response) => {
        this.setState({
          hospitalSchedules: response.data,
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

  dateRangeChanged = (dateRange) => {
    this.setState({
      dateRange,
    });
  }

  render() {
    const { saving } = this.state;
    const { visible, onCancel } = this.props;

    const rowSelection = {
      type: 'radio',
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (rowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: rowKeys,
          selectedRows,
        });
      },
    };
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        width={800}
        visible={visible}
        title="Select Hospital"
        okText="Save"
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button
            key="save"
            type="primary"
            loading={saving}
            onClick={this.onSave}
            disabled={this.state.selectedRows.length === 0}
          >
            Select
          </Button>,
        ]}
      >
        <div style={{ paddingLeft: 10, paddingRight: 10 }}>
          <Row gutter={10}>
            <Col span={12}>
              <RangePicker
                value={this.state.dateRange}
                onChange={this.dateRangeChanged}
                style={{ width: '100%' }}
              />
            </Col>
            <Col span={12}>
              <span>
                <Button
                  shape="circle"
                  icon="search"
                  onClick={this.fetchHospitalSchedules}
                  style={{ marginRight: 15 }}
                />
              </span>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                dataSource={this.state.hospitalSchedules}
                style={{ marginTop: 20 }}
                rowKey="id"
                loading={this.state.loading}
                size="small"
                rowSelection={rowSelection}
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
                  dataIndex="departmentQuota"
                  key="departmentQuota"
                  render={text => (
                    <Badge
                      count={text}
                      overflowCount={1000}
                      showZero
                      style={{ backgroundColor: '#fff', color: '#999', boxShadow: '0 0 0 1px #d9d9d9 inset' }}
                    />
                  )}
                />
                <Column
                  title="Students"
                  dataIndex="studentsInDepartmentCount"
                  key="studentsInDepartmentCount"
                  render={(text, record) => {
                    const departmentQuota = parseInt(record.departmentQuota, 10);
                    const studentsInDepartmentCount = parseInt(text, 10);
                    if (studentsInDepartmentCount <= departmentQuota) {
                      return (
                        <Badge
                          count={text}
                          overflowCount={1000}
                          showZero
                          style={{ backgroundColor: '#87d068' }}
                        />
                      );
                    }

                    return (
                      <Badge
                        count={text}
                        overflowCount={1000}
                        showZero
                      />
                    );
                  }}
                />
                <Column
                  title="History"
                  dataIndex="studentHistoryCount"
                  key="studentHistoryCount"
                  render={text => (<span style={{ width: '100%', textAlign: 'center ' }}>
                    {text}
                  </span>)}
                />
              </Table>
            </Col>
          </Row>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(HospitalSelectWindow);
