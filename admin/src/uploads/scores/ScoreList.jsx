import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, Upload, message, Popconfirm, notification } from 'antd';
import moment from 'moment';
import showError from '../../utils/ShowError';
import ScoreWindow from './ScoreWindow';

const SCORES_URL = `${process.env.REACT_APP_SERVER_URL}/api/uploadscores`;
const SCORES_UPLOAD_URL = `${process.env.REACT_APP_SERVER_URL}/api/uploadscorefile`;
const Column = Table.Column;

const uploadProps = {
  name: 'scoreFile',
  headers: {
    authorization: 'authorization-text',
  },
};

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
    this.fetchScores();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchScores();
  }

  onChangePasswordSuccess = () => {
    this.closeChangePasswordWindow();
    this.fetchScores();
  }

  fetchScores() {
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

  filterScores = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchScores(); });
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
    }, () => { this.fetchScores(); });
  }

  render() {
    const { score } = this.state;
    const { courseId } = this.props || 0;

    const token = window.sessionStorage.getItem('token');
    uploadProps.headers = {
      authorization: `Bearer ${token}`,
    };
    uploadProps.action = SCORES_UPLOAD_URL;
    uploadProps.onChange = (info) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.fetchScores();

        notification.success({
          message: 'Upload file success',
          description: JSON.stringify(info.file.response),
        });
      } else if (info.file.status === 'error') {
        notification.error({
          message: 'Upload file error',
          description: `${info.file.name} file upload failed.`,
        });
      }
    };
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
          <Col span={2}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterScores}
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
          <Col span={8}>
            <Row>
              <Col span={2}>
                <Upload {...uploadProps}>
                  <Button
                    shape="circle"
                    icon="upload"
                    style={{ marginLeft: 10 }}
                  />
                </Upload>
              </Col>
              <Col span={12}>
                <Button
                  shape="circle"
                  icon="download"
                  onClick={() => this.download({})}
                  style={{ marginLeft: 15 }}
                />
              </Col>
            </Row>
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
                title="Department"
                dataIndex="Course.Department.name"
              />
              <Column
                title="Name"
                dataIndex="Course.Student.name"
              />
              <Column
                title="Old SID"
                dataIndex="Course.Student.oldSid"
              />
              <Column
                title="New SID"
                dataIndex="Course.Student.newSid"
              />
              <Column
                title="Score"
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
          initialStudent={score && score.Course ? score.Course.Student : undefined}
          visible={this.state.scoreWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          score={score}
          ref={scoreWindow => (this.scoreWindow = scoreWindow)}
        />
      </div>
    );
  }
}

export default ScoreList;
