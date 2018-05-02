import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const SEMINAR_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/seminartypesbydepartment`;

class SeminarTypeSelect extends Component {
  constructor(props) {
    super(props);

    const { value, department } = this.props;
    this.state = {
      value,
      seminarTypes: [],
      department,
    };
  }

  componentDidMount() {
    this.fetchSeminarTypes();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value }, () => {
        if (this.state.department !== nextProps.department) {
          this.setState({ value: undefined, department: nextProps.department }, () => {
            this.fetchSeminarTypes();
          });
        }
      });
    } else if (this.state.department !== nextProps.department) {
      this.setState({ value: undefined, department: nextProps.department }, () => {
        this.fetchSeminarTypes();
      });
    }
  }

  fetchSeminarTypes() {
    const { department } = this.state;
    axios.get(SEMINAR_TYPES_URL, { params: {
      department,
    } })
      .then((response) => {
        this.setState({
          seminarTypes: response.data,
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
        {this.state.seminarTypes.map(seminarType => (
          <Option key={seminarType.id} value={seminarType.id}>{seminarType.name}</Option>
        ))}
      </Select>
    );
  }
}

export default SeminarTypeSelect;
