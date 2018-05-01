import React, { Component } from 'react';
import axios from 'axios';
import { Table, Row, Col, Button } from 'antd';
import moment from 'moment';
import showError from '../../utils/ShowError';

const Column = Table.Column;
const STUDENT_ASSISTANCES_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistanceparticipants`;
const getAssistancesUrl = studentId => `${STUDENT_ASSISTANCES_URL}/bystudent/${studentId}`;

class AssistanceList extends Component {
  state = {
    assistances: [],
    loading: false,
  }
  componentDidMount() {
    this.fetchAssistances();
  }

  fetchAssistances = () => {
    const { studentId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getAssistancesUrl(studentId), { params: {} })
      .then((response) => {
        this.setState({
          assistances: response.data,
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
      <div style={{ marginTop: -15 }}>
        <Row gutter={10} style={{ marginTop: 10 }}>
          <Col span={16}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.fetchAssistances}
              />
            </span>
          </Col>
        </Row>
        <Table
          dataSource={this.state.assistances}
          style={{ marginTop: 10 }}
          rowKey="id"
          loading={this.state.loading}
          size="small"
        >
          <Column
            title="Title"
            dataIndex="name"
            key="name"
          />
          <Column
            title="Date"
            dataIndex="eventDate"
            key="eventDate"
            render={text => (
              <span>
                {moment(text).format('DD/MM/YYYY')}
              </span>
            )}
          />
          <Column
            title="Time"
            dataIndex="eventTime"
            key="eventTime"
            render={text => (
              <span>
                {moment(text).format('HH:mm:ss')}
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}

export default AssistanceList;
