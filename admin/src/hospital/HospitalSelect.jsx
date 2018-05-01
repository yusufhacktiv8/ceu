import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

// const Option = Select.Option;
const { Option, OptGroup } = Select;
const HOSPITALS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitals`;

class HospitalSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      hospitals: [],
    };
  }

  componentDidMount() {
    this.fetchHospitals();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchHospitals() {
    axios.get(HOSPITALS_URL, { params: {} })
      .then((response) => {
        this.setState({
          hospitals: response.data,
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
    const { hospitalType } = this.props;
    return (
      this.props.hospitalType === -1 ? (
        <Select
          placeholder="Select Hospital"
          onChange={this.handleChange}
          value={this.state.value}
          style={{ width: '100%' }}
        >
          <OptGroup label="Hospital">
            {this.state.hospitals.filter(hospital => hospital.hospitalType === 1).map(hospital => (
              <Option key={hospital.id} value={String(hospital.id)}>{hospital.name}</Option>
            ))}
          </OptGroup>
          <OptGroup label="Clinic">
            {this.state.hospitals.filter(hospital => hospital.hospitalType === 2).map(hospital => (
              <Option key={hospital.id} value={String(hospital.id)}>{hospital.name}</Option>
            ))}
          </OptGroup>
        </Select>
      ) : (
        <Select
          placeholder="Select Hospital"
          onChange={this.handleChange}
          value={this.state.value}
          style={{ width: '100%' }}
        >
          {this.state.hospitals.filter(hospital => hospital.hospitalType === hospitalType).map(hospital => (
            <Option key={hospital.id} value={hospital.id}>{hospital.name}</Option>
          ))}
        </Select>
      )

    );
  }
}

export default HospitalSelect;
