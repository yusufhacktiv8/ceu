import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class LevelSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
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
        placeholder="Select Level"
        onChange={this.handleChange}
        value={this.state.value}
      >
        <Option value={1}>Level 1</Option>
        <Option value={2}>Level 2</Option>
      </Select>
    );
  }
}

export default LevelSelect;
