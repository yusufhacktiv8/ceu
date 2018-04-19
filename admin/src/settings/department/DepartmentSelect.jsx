import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const DEPARTMENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/departments`;

class DepartmentSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      departments: [],
    };
  }

  componentDidMount() {
    this.fetchDepartments();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchDepartments() {
    axios.get(DEPARTMENTS_URL, { params: {
      searchText: '',
      searchLevel: this.props.level || 1,
      start: 0,
      count: 100,
    } })
      .then((response) => {
        this.setState({
          departments: response.data.rows,
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
    return (
      <Select
        placeholder="Select Department"
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.state.departments.map(department => (
          <Option key={department.id} value={department.id}>{department.name}</Option>
        ))}
      </Select>
    );
  }
}

export default DepartmentSelect;
