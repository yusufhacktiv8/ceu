import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../../../utils/ShowError';

const Option = Select.Option;
const COURSE_PROBLEM_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courseproblemtypes`;

class CourseProblemTypeSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      courseProblemTypes: [],
    };
  }

  componentDidMount() {
    this.fetchCourseProblemTypes();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchCourseProblemTypes() {
    axios.get(COURSE_PROBLEM_TYPES_URL, { params: {} })
      .then((response) => {
        this.setState({
          courseProblemTypes: response.data,
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
        {this.state.courseProblemTypes.map(courseProblemType => (
          <Option key={courseProblemType.id} value={courseProblemType.id}>{courseProblemType.name}</Option>
        ))}
      </Select>
    );
  }
}

export default CourseProblemTypeSelect;
