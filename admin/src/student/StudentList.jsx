import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import StudentWindow from './StudentWindow';
import LevelSelect from './LevelSelect';
import showError from '../utils/ShowError';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const Column = Table.Column;

class StudentList extends Component {
  state = {
    searchText: '',
    student: {},
    students: [],
    loading: false,
    level: 1,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    studentWindowVisible: false,
  }
  componentDidMount() {
    this.fetchStudents();
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchStudents();
  }

  fetchStudents() {
    this.setState({
      loading: true,
    });
    axios.get(STUDENTS_URL, { params: {
      level: this.state.level,
      searchText: this.state.searchText,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          students: response.data.rows,
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

  filterStudents() {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchStudents(); });
  }

  deleteStudent(student) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${STUDENTS_URL}/${student.id}`)
      .then(() => {
        hide();
        this.fetchStudents();
        message.success('Delete student success');
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
      });
  }

  openEditWindow(record) {
    this.setState({
      student: record,
      studentWindowVisible: true,
    }, () => {
      this.studentWindow.resetFields();
    });
  }

  openDetailsPage = (record) => {
    this.props.history.push(`/students/${record.id}`);
  }

  closeEditWindow = () => {
    this.setState({
      studentWindowVisible: false,
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
    }, () => { this.fetchStudents(); });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={6}>
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
          <Col span={4}>
            <LevelSelect
              value={this.state.level}
              onChange={(e) => {
                this.setState({
                  level: e,
                });
              }}
            />
          </Col>
          <Col span={14}>
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
                render={(columnText, record) => {
                  const reg = new RegExp(this.state.searchText, 'gi');
                  const match = columnText.match(reg);
                  return (
                    <span key={record.name}>
                      {columnText.split(reg).map((text, i) => (
                        i > 0 ? [<span key={record.name} style={{ color: '#F50' }}>{match[0]}</span>, text] : text
                      ))}
                    </span>
                  );
                }}
              />
              <Column
                title="Old SID"
                dataIndex="oldSid"
                key="oldSid"
                render={(columnText, record) => {
                  const reg = new RegExp(this.state.searchText, 'gi');
                  const match = columnText.match(reg);
                  return (
                    <span key={record.oldSid}>
                      {columnText.split(reg).map((text, i) => (
                        i > 0 ? [<span key={record.oldSid} style={{ color: '#F50' }}>{match[0]}</span>, text] : text
                      ))}
                    </span>
                  );
                }}
              />
              <Column
                title="New SID"
                dataIndex="newSid"
                key="newSid"
                render={(columnText, record) => {
                  const reg = new RegExp(this.state.searchText, 'gi');
                  const match = columnText.match(reg);
                  return (
                    <span key={record.newSid}>
                      {columnText.split(reg).map((text, i) => (
                        i > 0 ? [<span key={record.newSid} style={{ color: '#F50' }}>{match[0]}</span>, text] : text
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
                    <Button
                      icon="bars"
                      size="small"
                      onClick={() => this.openDetailsPage(record)}
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

        <StudentWindow
          visible={this.state.studentWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          student={this.state.student}
          ref={studentWindow => (this.studentWindow = studentWindow)}
        />
      </div>
    );
  }
}

export default StudentList;
