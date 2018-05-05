import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const SGL_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/sgltypesbydepartment`;

class SglTypeSelect extends Component {
  constructor(props) {
    super(props);

    const { value } = this.props;
    this.state = {
      value,
      sglTypes: [],
    };
  }

  componentDidMount() {
    this.fetchSglTypes();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  fetchSglTypes() {
    const { department } = this.props;
    axios.get(SGL_TYPES_URL, { params: {
      department,
    } })
      .then((response) => {
        this.setState({
          sglTypes: response.data,
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
        placeholder="Select Type"
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.state.sglTypes.map(sglType => (
          <Option key={sglType.id} value={sglType.id}>{sglType.name}</Option>
        ))}
      </Select>
    );
  }
}

export default SglTypeSelect;
