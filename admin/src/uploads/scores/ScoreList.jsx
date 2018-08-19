import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import moment from 'moment';
import showError from '../../utils/ShowError';
import ScoreWindow from '../../student/course/details/score/ScoreWindow';

const SCORES_URL = `${process.env.REACT_APP_SERVER_URL}/api/uploadscores`;
const Column = Table.Column;

class ScoreList extends Component {
  state = {
    searchText: '',
    score: {},
    scores: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    scoreWindowVisible: false,
    changePasswordWindowVisible: false,
  }
  componentDidMount() {
    this.fetchUsers();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchUsers();
  }

  onChangePasswordSuccess = () => {
    this.closeChangePasswordWindow();
    this.fetchUsers();
  }

  fetchUsers() {
    this.setState({
      loading: true,
    });
    axios.get(SCORES_URL, { params: {
      searchText: this.state.searchText,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          scores: response.data.rows,
          count: response.data.count,
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

  filterUsers = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchUsers(); });
  }

  deleteUser(score) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${SCORES_URL}/${score.id}`)
      .then(() => {
        message.success('Delete score success');
        this.fetchUsers();
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

  closeChangePasswordWindow = () => {
    this.setState({
      changePasswordWindowVisible: false,
    });
  }

  openChangePasswordWindow = (record) => {
    this.setState({
      score: record,
      changePasswordWindowVisible: true,
    }, () => {
      this.changePasswordWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      scoreWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchUsers(); });
  }

  render() {
    const { courseId } = this.props || 0;
    return (
      <div>
        <Row gutter={10}>
          <Col span={8}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Username or name"
              maxLength="100"
            />
          </Col>
          <Col span={16}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterUsers}
                style={{ marginRight: 15 }}
              />
              <Button
                type="primary"
                shape="circle"
                icon="plus"
                onClick={() => this.openEditWindow({})}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.scores}
              style={{ marginTop: 20 }}
              rowKey="id"
              loading={this.state.loading}
              pagination={{
                total: this.state.count,
                current: this.state.currentPage,
                pageSize: this.state.pageSize,
              }}
              onChange={this.pageChanged}
              size="small"
            >
              <Column
                title="Value"
                dataIndex="scoreValue"
                key="scoreValue"
              />
              <Column
                title="Type"
                dataIndex="ScoreType.name"
              />
              <Column
                title="Date"
                dataIndex="scoreDate"
                key="scoreDate"
                render={(text, record) => (
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
                      title={`Are you sure delete score ${record.ScoreType.name}`}
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
          </Col>
        </Row>

        <ScoreWindow
          courseId={courseId}
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
