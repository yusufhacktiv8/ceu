import React, { Component } from 'react';
import { Input, Button, Col } from 'antd';
import HospitalSelectWindow from './HospitalSelectWindow';

const InputGroup = Input.Group;

class HospitalSelect extends Component {
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
    this.closeHospitalSelectWindow();
  }

  showHospitalSelectWindow = () => {
    this.setState({
      hospitalSelectWindowVisible: true,
    });
  }

  closeHospitalSelectWindow = () => {
    this.setState({
      hospitalSelectWindowVisible: false,
    });
  }

  render() {
    const { studentId, departmentId, hospitalType, disabled } = this.props;
    return (
      <InputGroup size="medium">
        <Col span={20}>
          <Input
            value={this.state.value ? this.state.value.name : ''}
            placeholder="Please select"
          />
        </Col>
        <Col span={4}>
          <span>
            <Button
              icon="close-circle"
              style={{ height: 32 }}
              onClick={() => this.handleChange(null)}
              disabled={disabled}
            />
          </span>
          <span>
            <Button
              icon="select"
              style={{ height: 32, marginLeft: 5 }}
              onClick={this.showHospitalSelectWindow}
              disabled={disabled}
            />
          </span>
        </Col>
        <HospitalSelectWindow
          visible={this.state.hospitalSelectWindowVisible}
          studentId={studentId}
          departmentId={departmentId}
          hospitalType={hospitalType}
          onSelect={this.handleChange}
          onCancel={this.closeHospitalSelectWindow}
          onClose={this.closeHospitalSelectWindow}
        />
      </InputGroup>
    );
  }
}

export default HospitalSelect;
