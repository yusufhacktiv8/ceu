import React, { Component } from 'react';
import { Select, Spin } from 'antd';
import axios from 'axios';
import debounce from 'lodash/debounce';
import showError from '../utils/ShowError';

const Option = Select.Option;
const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;

class StudentSearch extends Component {
  constructor(props) {
    super(props);

    this.fetchStudents = debounce(this.fetchStudents, 800);

    const value = this.props.value;
    const initialStudent = this.props.initialStudent;
    const students = [];
    if (initialStudent) {
      students.push(initialStudent);
    }
    this.state = {
      value,
      students,
      fetching: false,
    };
  }

  // componentDidMount() {
  //   this.fetchStudents();
  // }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value }, () => {
        const students = [];
        if (nextProps.initialStudent) {
          students.push(nextProps.initialStudent);
          this.setState({ students });
        }
      });
    }
  }

  fetchStudents = (searchText) => {
    axios.get(STUDENTS_URL, { params: {
      searchText,
      start: 0,
      count: 100,
    } })
      .then((response) => {
        this.setState({
          students: response.data.rows,
        });
      })
      .catch((error) => {
        showError(error);
      });
  }

  handleChange = (value) => {
    if (!('value' in this.props)) {
      this.setState({ value });
    }
    this.triggerChange(value);
  }

  triggerChange = (changedValue) => {
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(changedValue);
    }
  }

  render() {
    const { fetching } = this.state;
    return (
      <Select
        allowClear
        placeholder="Select Student"
        showSearch
        filterOption={false}
        onChange={this.handleChange}
        value={this.state.value}
        onSearch={this.fetchStudents}
        notFoundContent={fetching ? <Spin size="small" /> : null}
      >
        {this.state.students.map(student => (
          <Option key={student.id} value={`${student.id}`}>{`${student.name} (${student.oldSid} - ${student.newSid})`}</Option>
        ))}
      </Select>
    );
  }
}

export default StudentSearch;
