import React, { Component } from 'react';
import axios from 'axios';
import { Table, Checkbox, Row, Col, Button, Menu, message, Popconfirm } from 'antd';
import moment from 'moment';
import showError from '../../utils/ShowError';
import ScoreWindow from './ScoreWindow';

const Column = Table.Column;
const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const SCORES_URL = `${process.env.REACT_APP_SERVER_URL}/api/ukmppds`;
const getScoresUrl = studentId => `${STUDENTS_URL}/${studentId}/ukmppds`;

class ScoreList extends Component {
  state = {
    scores: [],
    score: {},
    loading: false,
    activeKey: 'CBT',
    scoreWindowVisible: false,
  }
  componentDidMount() {
    this.fetchScores();
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
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

  deleteScore(score) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${SCORES_URL}/${score.id}`)
      .then(() => {
        message.success('Delete score success');
        this.fetchScores();
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
      });
  }

  openEditWindow = (record) => {
    this.setState({
      score: record,
      scoreWindowVisible: true,
    }, () => {
      this.scoreWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      scoreWindowVisible: false,
    });
  }

  render() {
    const { studentId } = this.props;
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
              <Menu.Item key="CBT">
                CBT
              </Menu.Item>
              <Menu.Item key="OSCE">
                OSCE
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
            title="Selected"
            dataIndex="selected"
            render={(text, record) => (
              <span>
                <Checkbox checked={record.selected} />
              </span>
            )}
          />
          <Column
            title="Score"
            dataIndex="score"
          />
          <Column
            title="Type"
            dataIndex="testType"
          />
          <Column
            title="Date"
            dataIndex="testDate"
            key="testDate"
            render={text => (
              <span>
                {moment(text).format('DD/MM/YYYY')}
              </span>
            )}
          />
          <Column
            title="Action"
            key="action"
            render={(text, record) => (
              <span>
                <Button
                  icon="ellipsis"
                  size="small"
                  onClick={() => this.openEditWindow(record)}
                  style={{ marginRight: 5 }}
                />
                <Popconfirm
                  title={'Are you sure delete score?'}
                  onConfirm={() => this.deleteScore(record)}
                  okText="Yes" cancelText="No"
                >
                  <Button
                    type="danger"
                    icon="delete"
                    size="small"
                  />
                </Popconfirm>
              </span>
            )}
          />
        </Table>
        <ScoreWindow
          studentId={studentId}
          visible={this.state.scoreWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          score={this.state.score}
          ref={scoreWindow => (this.scoreWindow = scoreWindow)}
        />
      </div>
    );
  }
}

export default ScoreList;
