import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Upload, Row, Col, Tag, Icon, Spin, notification } from 'antd';
import showError from '../utils/ShowError';

const ASSISTANCES_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistances`;
const getParticipantUrl = assistanceId => `${ASSISTANCES_URL}/${assistanceId}/participants`;
const Column = Table.Column;

const ASSISTANCE_UPLOAD_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistanceupload`;

const uploadProps = {
  name: 'assistanceFile',
  headers: {
    authorization: 'authorization-text',
  },
};

class ParticipantList extends Component {
  state = {
    searchText: '',
    assistance: {},
    participants: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    participantWindowVisible: false,
  }
  componentDidMount() {
    this.fetchParticipants();
    this.fetchAssistance();
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
    const { assistanceId } = match.params;
    this.setState({
      loading: true,
    });
    axios.get(getParticipantUrl(assistanceId), { params: {
      searchText: this.state.searchText,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
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

  fetchAssistance() {
    const { match } = this.props;
    const { assistanceId } = match.params;
    this.setState({
      loading: true,
    });
    axios.get(`${ASSISTANCES_URL}/${assistanceId}`, { params: {} })
      .then((response) => {
        this.setState({
          assistance: response.data,
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
    const { assistanceId } = match.params;
    uploadProps.action = `${ASSISTANCE_UPLOAD_URL}/${assistanceId}`;
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
              this.state.assistance.code ? (
                <span>
                  <Tag style={{ height: 26, fontSize: 15 }} color="#2db7f5">{ this.state.assistance.name}</Tag>
                  <Tag style={{ height: 26, fontSize: 15 }}>{ this.state.assistance.code}</Tag>
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
