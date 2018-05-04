import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

// const Option = Select.Option;
const { Option } = Select;
const PENGAMPUS_URL = `${process.env.REACT_APP_SERVER_URL}/api/pengampusbydepartment`;

class PengampuSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      pengampus: [],
    };
  }

  componentDidMount() {
    this.fetchPengampus();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchPengampus() {
    const { departmentId } = this.props;
    axios.get(PENGAMPUS_URL, { params: {
      department: departmentId,
    } })
      .then((response) => {
        this.setState({
          pengampus: response.data,
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
        placeholder="Select Pengampu"
        onChange={this.handleChange}
        value={this.state.value}
        style={{ width: '100%' }}
      >
        {this.state.pengampus.map(pengampu => (
          <Option key={pengampu.id} value={String(pengampu.id)}>{pengampu.name}</Option>
        ))}
      </Select>
    );
  }
}

export default PengampuSelect;
