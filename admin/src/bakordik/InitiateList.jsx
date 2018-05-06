import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Input, Table, Button, DatePicker, Row, Col, Tag } from 'antd';
import showError from '../utils/ShowError';

const { RangePicker } = DatePicker;

const INITIATES_URL = `${process.env.REACT_APP_SERVER_URL}/api/bakordik/initiatestudents`;
const Column = Table.Column;

class InitiateList extends Component {
  state = {
    searchText: '',
    courses: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
  }

  componentDidMount() {
    this.fetchCourses();
  }

  onRangeChange = (e) => {
    this.setState({
      dateRange: e,
    });
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeExportWindow();
    this.fetchCourses();
  }

  fetchCourses() {
    this.setState({
      loading: true,
    });
    axios.get(INITIATES_URL, { params: {
      searchText: this.state.searchText,
      dateRange: this.state.dateRange,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          courses: response.data.rows,
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

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchCourses(); });
  }

  showDetails = (record) => {
    const studentId = record.Student.id;
    const courseId = record.id;
    this.props.history.push(`/students/${studentId}/courses/${courseId}`);
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
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Name or SID"
              maxLength="50"
            />
          </Col>
          <Col span={10}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={() => this.fetchCourses()}
                style={{ marginRight: 5 }}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.courses}
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
            >
              <Column
                title="Plan Start Date"
                dataIndex="planStartDate"
                key="planStartDate"
                render={text => (
                  <span>
                    {moment(text).format('DD/MM/YYYY')}
                  </span>
                )}
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
                title="Name"
                dataIndex="Student.name"
              />
              <Column
                title="Title"
                dataIndex="title"
                key="title"
              />
              <Column
                title="Department"
                dataIndex="Department.name"
                render={(text, record) => (
                  <Tag className="CourseListItem-tag" color={record.Department.color} onClick={() => this.showDetails(record)}>
                    {text}
                  </Tag>
                )}
              />
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default InitiateList;
