import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

// const Option = Select.Option;
const { Option } = Select;
const DOCENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/docentsbyhd`;

class DocentSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      docents: [],
    };
  }

  componentDidMount() {
    this.fetchDocents();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchDocents() {
    const { hospitalId, departmentId } = this.props;
    axios.get(DOCENTS_URL, { params: {
      hospital: hospitalId,
      department: departmentId,
    } })
      .then((response) => {
        this.setState({
          docents: response.data,
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
        placeholder="Select Docent"
        onChange={this.handleChange}
        value={this.state.value}
        style={{ width: '100%' }}
      >
        {this.state.docents.map(docent => (
          <Option key={docent.id} value={String(docent.id)}>{docent.name}</Option>
        ))}
      </Select>
    );
  }
}

export default DocentSelect;
