import React, { Component } from 'react';
import { Select } from 'antd';
import axios from 'axios';
import showError from '../../../../utils/ShowError';

const Option = Select.Option;
const SCORE_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/scoretypes`;

class ScoreTypeSelect extends Component {
  constructor(props) {
    super(props);

    const value = this.props.value;
    this.state = {
      value,
      scoreTypes: [],
    };
  }

  componentDidMount() {
    this.fetchScoreTypes();
  }

  componentWillReceiveProps(nextProps) {
    if ('value' in nextProps) {
      const value = nextProps.value;
      this.setState({ value });
    }
  }

  fetchScoreTypes() {
    axios.get(SCORE_TYPES_URL, { params: {
      searchText: '',
      start: 0,
      count: 100,
    } })
      .then((response) => {
        this.setState({
          scoreTypes: response.data,
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
        placeholder="Select Type"
        onChange={this.handleChange}
        value={this.state.value}
        style={{ width: '100%' }}
      >
        {this.state.scoreTypes.map(scoreType => (
          <Option key={scoreType.id} value={scoreType.id}>{scoreType.name}</Option>
        ))}
      </Select>
    );
  }
}

export default ScoreTypeSelect;
