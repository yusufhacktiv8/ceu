import React, { Component } from 'react';
import { Button, Modal, Table } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

const Column = Table.Column;

const HOSPITAL_STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitalselect/hospitalstudents`;

class HospitalStudentList extends Component {
  state = {
    hospitalStudents: [],
    hospitalDateRange: [],
    loading: false,
  }

  // componentDidMount() {
  //   this.fetchHospitalStudents();
  // }
  //
  // componentWillReceiveProps(nextProps) {
  //   if (nextProps.visible) {
  //     this.fetchHospitalStudents();
  //   }
  // }

  fetchHospitalStudents() {
    const { hospitalId, departmentId, hospitalDateRange } = this.props;

    if (hospitalId === undefined) return;

    const tempDepartmentId = departmentId || -1;
    this.setState({
      loading: true,
    });
    axios.get(`${HOSPITAL_STUDENTS_URL}/${hospitalId}/${tempDepartmentId}`, { params: {
      hospitalDateRange,
    } })
      .then((response) => {
        this.setState({
          hospitalStudents: response.data,
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

  render() {
    const { visible, onCancel } = this.props;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        width={700}
        visible={visible}
        title="Hospital Students"
        okText="Close"
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>Close</Button>,
        ]}
      >
        <Table
          dataSource={this.state.hospitalStudents}
          rowKey="id"
          loading={this.state.loading}
          size="small"
        >
          <Column
            title="New SID"
            dataIndex="newSid"
            key="newSid"
          />
          <Column
            title="Old SID"
            dataIndex="oldSid"
            key="oldSid"
          />
          <Column
            title="Name"
            dataIndex="name"
            key="name"
          />
          <Column
            title="Department"
            dataIndex="departmentName"
            key="departmentName"
          />
        </Table>
      </Modal>
    );
  }
}

export default HospitalStudentList;
