import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Upload, Row, Col, Tag, Icon, Spin, notification } from 'antd';
import showError from '../utils/ShowError';

const SEMINARS_URL = `${process.env.REACT_APP_SERVER_URL}/api/seminars`;
const getParticipantUrl = seminarId => `${SEMINARS_URL}/${seminarId}/participants`;
const Column = Table.Column;

const SEMINAR_UPLOAD_URL = `${process.env.REACT_APP_SERVER_URL}/api/seminarupload`;

const uploadProps = {
  name: 'seminarFile',
  headers: {
    authorization: 'authorization-text',
  },
};

class ParticipantList extends Component {
  state = {
    searchText: '',
    seminar: {},
    participants: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    participantWindowVisible: false,
  }
  componentDidMount() {
    this.fetchParticipants();
    this.fetchSeminar();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchParticipants();
  }

  fetchParticipants() {
    const { match } = this.props;
    const { seminarId } = match.params;
    this.setState({
      loading: true,
    });
    axios.get(getParticipantUrl(seminarId), { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          participants: response.data.rows,
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

  fetchSeminar() {
    const { match } = this.props;
    const { seminarId } = match.params;
    this.setState({
      loading: true,
    });
    axios.get(`${SEMINARS_URL}/${seminarId}`, { params: {} })
      .then((response) => {
        this.setState({
          seminar: response.data,
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

  filterParticipants = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchParticipants(); });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchParticipants(); });
  }

  render() {
    const { match } = this.props;
    const { seminarId } = match.params;
    uploadProps.action = `${SEMINAR_UPLOAD_URL}/${seminarId}`;
    uploadProps.onChange = (info) => {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        this.fetchParticipants();

        notification.success({
          message: 'Upload file success',
          description: info.file.response,
        });
      } else if (info.file.status === 'error') {
        notification.error({
          message: 'Upload file error',
          description: `${info.file.name} file upload failed.`,
        });
      }
    };
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <div>
        <Row style={{ marginTop: -5, marginBottom: 12 }}>
          <Col span={8}>
            {
              this.state.seminar.code ? (
                <span>
                  <Tag style={{ height: 26, fontSize: 15 }} color="#2db7f5">{ this.state.seminar.name}</Tag>
                  <Tag style={{ height: 26, fontSize: 15 }}>{ this.state.seminar.code}</Tag>
                </span>
              ) : (
                <Spin indicator={antIcon} />
              )
            }
          </Col>
        </Row>
        <Row gutter={10}>
          <Col span={8}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Name or SID"
              maxLength="50"
            />
          </Col>
          <Col span={8}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterParticipants}
                style={{ marginRight: 15 }}
              />
              <Upload {...uploadProps}>
                <Button
                  type="primary"
                  shape="circle"
                  icon="upload"
                />
              </Upload>
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.participants}
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
                title="Old SID"
                dataIndex="Student.oldSid"
              />
              <Column
                title="New SID"
                dataIndex="Student.newSid"
              />
              <Column
                title="Name"
                dataIndex="Student.name"
              />
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default ParticipantList;
