import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const Column = Table.Column;

class StudentList extends Component {
  state = {
    searchText: '',
    student: {},
    students: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    studentWindowVisible: false,
  }
  componentDidMount() {
    this.getStudents();
  }

  getStudents() {
    this.setState({
      loading: true,
    });
    axios.get(STUDENTS_URL, { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          students: response.data.students,
          count: response.data.count,
          loading: false,
        });
      })
      .catch((error) => {
        console.error(error);
        if (error.response) {

        } else {
          message.error(error.message);
        }
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  filterStudents() {
    this.setState({
      currentPage: 1,
    }, () => { this.getStudents(); });
  }

  saveStudent(student) {
    const hide = message.loading('Action in progress..', 0);
    axios.post(STUDENTS_URL, student)
      .then(() => {
        hide();
        this.handleCancel();
        this.getStudents();
        message.success('Save student success');
      })
      .catch((error) => {
        hide();
        console.error(error);
      });
  }

  deleteStudent(student) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${STUDENTS_URL}/${student.id}`)
      .then(() => {
        hide();
        this.getStudents();
        message.success('Delete student success');
      })
      .catch((error) => {
        hide();
        console.error(error);
      });
  }

  openEditWindow(record) {
    this.setState({
      student: record,
      studentWindowVisible: true,
    });
  }

  handleCancel() {
    this.setState({
      studentWindowVisible: false,
    });
    this.studentWindow.resetFields();
  }

  handleCreate() {
    this.studentWindow.validateFields((err, values) => {
      if (err) {
        return;
      }

      this.saveStudent(values);
      this.studentWindow.resetFields();
      this.setState({ studentWindowVisible: false });
    });
  }

  pageChanged(page) {
    this.setState({
      currentPage: page,
    }, () => { this.getStudents(); });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={8}>
            <Input
              value={this.state.searchText}
              onChange={(e) => {
                this.setState({
                  searchText: e.target.value,
                });
              }}
              placeholder="Name or SID"
            />
          </Col>
          <Col span={16}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={() => this.filterStudents()}
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
              dataSource={this.state.students}
              style={{ marginTop: 20 }}
              rowKey="id"
              loading={this.state.loading}
              pagination={{
                total: this.state.count,
                current: this.state.currentPage,
                pageSize: this.state.pageSize,
              }}
              onChange={pagination => this.pageChanged(pagination.current)}
              size="small"
            >
              <Column
                title="Name"
                dataIndex="name"
                key="name"
              />
              <Column
                title="Old SID"
                dataIndex="oldSid"
                key="oldSid"
              />
              <Column
                title="New SID"
                dataIndex="newSid"
                key="newSid"
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
                      title={`Are you sure delete student ${record.name}`}
                      onConfirm={() => this.deleteStudent(record)}
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

export default StudentList;
