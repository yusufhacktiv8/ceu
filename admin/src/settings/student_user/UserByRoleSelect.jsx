import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const USERS_BY_ROLE_URL = `${process.env.REACT_APP_SERVER_URL}/api/usersbyrole`;

class UserByRoleSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      users: [],
    };
  }

  componentDidMount() {
    this.fetchUserByRoles();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchUserByRoles() {
    const { roleCode } = this.props;
    axios.get(USERS_BY_ROLE_URL, { params: {
      role: roleCode,
    } })
      .then((response) => {
        this.setState({
          users: response.data,
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
        placeholder="Select User"
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.state.users.map(user => (
          <Option key={user.id} value={user.id}>{user.name}</Option>
        ))}

      </Select>
    );
  }
}

export default UserByRoleSelect;
