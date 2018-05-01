import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const KOMPRE_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/kompretypes`;

class KompreTypeSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      kompreTypes: [],
    };
  }

  componentDidMount() {
    this.fetchKompreTypes();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchKompreTypes() {
    axios.get(KOMPRE_TYPES_URL, { params: {} })
      .then((response) => {
        this.setState({
          kompreTypes: response.data,
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
        {this.state.kompreTypes.map(kompreType => (
          <Option key={kompreType.id} value={kompreType.id}>{kompreType.name}</Option>
        ))}
      </Select>
    );
  }
}

export default KompreTypeSelect;
