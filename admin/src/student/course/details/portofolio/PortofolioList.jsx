import React, { Component } from 'react';
import axios from 'axios';
import { Table, Checkbox } from 'antd';
import moment from 'moment';
import showError from '../../../../utils/ShowError';

const Column = Table.Column;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getPortofoliosUrl = courseId => `${COURSES_URL}/${courseId}/portofolios`;

class PortofolioList extends Component {
  state = {
    portofolios: [],
    loading: false,
  }
  componentDidMount() {
    this.fetchPortofolios();
  }

  fetchPortofolios() {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getPortofoliosUrl(courseId), { params: {
      searchText: this.state.searchText,
    } })
      .then((response) => {
        this.setState({
          portofolios: response.data,
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
      <div style={{ marginTop: -15, overflow: 'scroll', height: 400 }}>
        <Table
          dataSource={this.state.portofolios}
          style={{ marginTop: 20 }}
          rowKey="id"
          loading={this.state.loading}
          size="small"
        >
          <Column
            title="Completed"
            dataIndex="completed"
            render={(text, record) => (
              <span>
                <Checkbox checked={record.completed} />
              </span>
            )}
          />
          <Column
            title="Type"
            dataIndex="PortofolioType.name"
            key="type"
          />
          <Column
            title="Date"
            dataIndex="problemDate"
            key="problemDate"
            render={(text, record) => (
              <span>
                {moment(text).format('DD/MM/YYYY')}
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default PortofolioList;
