import React, { Component } from 'react';
import axios from 'axios';
import { PieChart, Pie, Label, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import showError from '../utils/ShowError';

const DEPARTMENT_DASHBOARD_URL = `${process.env.REACT_APP_SERVER_URL}/api/dashboard/studentstatuscount`;
const COLORS = ['#5093E1', '#50C14E', '#F65177', '#9DA5BE', '#000'];

export default class StudentStatusCountChart extends Component {
  state = {
    students: [],
  }

  componentDidMount() {
    this.fetchDepartments();
  }

  fetchDepartments() {
    this.setState({
      loading: true,
    });
    axios.get(DEPARTMENT_DASHBOARD_URL, { params: {} })
      .then((response) => {
        this.setState({
          students: response.data,
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
    const data = this.state.students.map(obj => ({ name: obj.status, value: parseInt(obj.statusCount, 10) }));
    return (
      <ResponsiveContainer width="100%" aspect={2}>
        <PieChart width={200} height={250}>
          <Pie
            data={data}
            innerRadius={75}
            outerRadius={105}
            fill="#8884d8"
            paddingAngle={0}
            label={false}
            dataKey="value"
          >
            {
              data.map((entry, index) => (
                <Cell
                  key={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                />
              ))
            }
          </Pie>
          <Tooltip />
          <Legend />
          <Label />
        </PieChart>
      </ResponsiveContainer>
    );
  }
}
