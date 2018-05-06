import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const TUTORS_URL = `${process.env.REACT_APP_SERVER_URL}/api/tutors`;

class TutorSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      tutors: [],
    };
  }

  componentDidMount() {
    this.fetchTutors();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchTutors() {
    axios.get(TUTORS_URL, { params: {
      searchText: '',
      start: 0,
      count: 100,
    } })
      .then((response) => {
        this.setState({
          tutors: response.data.rows,
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
        placeholder="Select Tutor"
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.state.tutors.map(tutor => (
          <Option key={tutor.id} value={tutor.id}>{tutor.name}</Option>
        ))}
      </Select>
    );
  }
}

export default TutorSelect;
