import React, { Component } from 'react';
import { Select } from 'antd';

const Option = Select.Option;

class UkmppdTypeSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      ukmppdTypes: [
        {
          id: 'CBT',
          name: 'CBT',
        },
        {
          id: 'OSCE',
          name: 'OSCE',
        },
      ],
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
        placeholder="Select Type"
        onChange={this.handleChange}
        value={this.state.value}
      >
        {this.state.ukmppdTypes.map(ukmppdType => (
          <Option key={ukmppdType.id} value={ukmppdType.id}>{ukmppdType.name}</Option>
        ))}
      </Select>
    );
  }
}

export default UkmppdTypeSelect;
