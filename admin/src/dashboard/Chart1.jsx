import React, { Component } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import showError from '../utils/ShowError';

const DEPARTMENT_DASHBOARD_URL = `${process.env.REACT_APP_SERVER_URL}/api/dashboard/mppdcount`;

export default class Chart1 extends Component {
  state = {
    departments: [],
  }

  componentDidMount() {
    this.fetchDepartments();
  }

  fetchDepartments() {
    const { level } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(DEPARTMENT_DASHBOARD_URL, { params: { level } })
      .then((response) => {
        this.setState({
          departments: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }

  render() {
    return (
      <ResponsiveContainer width="100%" aspect={2}>
        <BarChart
          width={600}
          height={300}
          data={this.state.departments}
          margin={{ top: 5, left: -40, bottom: 5 }}
        >
          <XAxis dataKey="code" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
