import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const SUPERVISORS_URL = `${process.env.REACT_APP_SERVER_URL}/api/supervisorsforselect`;

class SupervisorSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      supervisors: [],
    };
  }

  componentDidMount() {
    this.fetchSupervisors();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchSupervisors() {
    axios.get(SUPERVISORS_URL, { params: {
      searchText: '',
      start: 0,
      count: 100,
    } })
      .then((response) => {
        this.setState({
          supervisors: response.data,
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
        allowClear
        placeholder="Select Supervisor"
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.state.supervisors.map(supervisor => (
          <Option key={supervisor.id} value={supervisor.id}>{supervisor.name}</Option>
        ))}
      </Select>
    );
  }
}

export default SupervisorSelect;
