import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const Option = Select.Option;
const PORTOFOLIO_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/portofoliotypesbydepartment`;

class PortofolioTypeSelect extends Component {
  constructor(props) {
    super(props);

    const { value } = this.props;
    this.state = {
      value,
      portofolioTypes: [],
    };
  }

  componentDidMount() {
    this.fetchPortofolioTypes();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const { value } = nextProps;
      this.setState({ value });
    }
  }

  fetchPortofolioTypes() {
    const { department } = this.props;
    axios.get(PORTOFOLIO_TYPES_URL, { params: {
      department,
    } })
      .then((response) => {
        this.setState({
          portofolioTypes: response.data,
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
        {this.state.portofolioTypes.map(portofolioType => (
          <Option key={portofolioType.id} value={portofolioType.id}>{portofolioType.name}</Option>
        ))}
      </Select>
    );
  }
}

export default PortofolioTypeSelect;
