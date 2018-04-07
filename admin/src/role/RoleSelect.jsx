import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

const Option = Select.Option;
const ROLES_URL = `${process.env.REACT_APP_SERVER_URL}/api/roles`;

class RoleSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      roles: [],
    };
  }

  componentDidMount() {
    this.fetchRoles();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchRoles() {
    axios.get(ROLES_URL, { params: {
      searchText: '',
      start: 0,
      count: 100,
    } })
      .then((response) => {
        this.setState({
          roles: response.data.rows,
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
        placeholder="Select Role"
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.state.roles.map(role => (
          <Option key={role.id} value={role.id}>{role.name}</Option>
        ))}
      </Select>
    );
  }
}

export default RoleSelect;
