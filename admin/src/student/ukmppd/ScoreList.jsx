import React, { Component } from 'react';
import axios from 'axios';
import { Table, Row, Col, Button, Menu } from 'antd';
import moment from 'moment';
import showError from '../../utils/ShowError';

const Column = Table.Column;
const STUDENT_ASSISTANCES_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistanceparticipants`;
const getScoresUrl = studentId => `${STUDENT_ASSISTANCES_URL}/bystudent/${studentId}`;

class ScoreList extends Component {
  state = {
    scores: [],
    loading: false,
    activeKey: 'K001',
  }
  componentDidMount() {
    this.fetchScores();
  }

  onTabsChange = (e) => {
    const activeKey = e.key;
    this.setState({ activeKey });
  }

  fetchScores = () => {
    const { studentId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getScoresUrl(studentId), { params: {} })
      .then((response) => {
        this.setState({
          scores: response.data,
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
                icon="retweet"
                onClick={this.fetchScores}
              />
              <Button
                type="primary"
                shape="circle"
                icon="plus"
                onClick={() => this.openEditWindow({})}
                style={{ marginLeft: 10 }}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <Menu
              mode="horizontal"
              selectedKeys={[this.state.activeKey]}
              onClick={this.onTabsChange}
              style={{ marginBottom: 10, backgroundColor: '#FAFAFA' }}
            >
              <Menu.Item key="K001">
                Pre Kompre
              </Menu.Item>
              <Menu.Item key="K002">
                Mid Kompre
              </Menu.Item>
              <Menu.Item key="K003">
                Final Kompre
              </Menu.Item>
              <Menu.Item key="K004">
                Try Out
              </Menu.Item>
            </Menu>
          </Col>
        </Row>
        <Table
          dataSource={this.state.scores.filter(score =>
            String(score.KompreType.code) === this.state.activeKey)}
          style={{ marginTop: 5 }}
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

export default ScoreList;
