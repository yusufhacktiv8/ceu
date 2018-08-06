import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const ASSISTANCE_TOPICS_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistancetopicsbydepartment`;

class AssistanceTopicSelect extends Component {
  constructor(props) {
    super(props);

    const { value, department } = this.props;
    this.state = {
      value,
      assistanceTopics: [],
      department,
    };
  }

  componentDidMount() {
    this.fetchAssistanceTopics();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value }, () => {
        if (this.state.department !== nextProps.department) {
          this.setState({ value: undefined, department: nextProps.department }, () => {
            this.fetchAssistanceTopics();
          });
        }
      });
    } else if (this.state.department !== nextProps.department) {
      this.setState({ value: undefined, department: nextProps.department }, () => {
        this.fetchAssistanceTopics();
      });
    }
  }

  fetchAssistanceTopics() {
    const { department } = this.state;
    axios.get(ASSISTANCE_TOPICS_URL, { params: {
      department,
    } })
      .then((response) => {
        this.setState({
          assistanceTopics: response.data,
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
        {this.state.assistanceTopics.map(assistanceTopic => (
          <Option key={assistanceTopic.id} value={assistanceTopic.id}>{assistanceTopic.name}</Option>
        ))}
      </Select>
    );
  }
}

export default AssistanceTopicSelect;
