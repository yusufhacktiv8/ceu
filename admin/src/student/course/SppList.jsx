import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Checkbox, Row, Col, Upload, message, Popconfirm, notification } from 'antd';
import moment from 'moment';
import showError from '../../utils/ShowError';
import SppWindow from './SppWindow';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const SPPS_URL = `${process.env.REACT_APP_SERVER_URL}/api/spps`;
const getSppsUrl = studentId => `${STUDENTS_URL}/${studentId}/spps`;
const FILES_URL = process.env.REACT_APP_FILES_URL;
const Column = Table.Column;

const getAuthorizationHeader = () => {
  const token = window.sessionStorage.getItem('token');
  return `Bearer ${token}`;
};

const getUploadProps = (sppId, afterUpload) => (
  {
    name: 'sppFile',
    headers: {
      authorization: getAuthorizationHeader(),
    },
    action: `${SPPS_URL}/${sppId}`,
    onChange: (info) => {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification.success({
          message: 'Upload success',
          description: info.file.response,
        });
        afterUpload();
      } else if (info.file.status === 'error') {
        notification.error({
          message: 'Upload error',
          description: `${info.file.name} file upload failed.`,
        });
      }
    },
  }
);

class SppList extends Component {
  state = {
    searchText: '',
    spp: {},
    spps: [],
    loading: false,
    sppWindowVisible: false,
  }
  componentDidMount() {
    this.fetchSpps();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchSpps();
  }

  fetchSpps() {
    const { studentId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getSppsUrl(studentId), { params: {} })
      .then((response) => {
        this.setState({
          spps: response.data,
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

  filterSpps = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchSpps(); });
  }

  deleteSpp(spp) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${SPPS_URL}/${spp.id}`)
      .then(() => {
        message.success('Delete SPP success');
        this.fetchSpps();
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
      });
  }

  deleteSppFile(spp) {
    const hide = message.loading('Action in progress..', 0);
    axios.put(`${SPPS_URL}/${spp.id}/deletefile`)
      .then(() => {
        message.success('Delete file success');
        this.fetchSpps();
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
      spp: record,
      sppWindowVisible: true,
    }, () => {
      this.sppWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      sppWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchSpps(); });
  }

  render() {
    const { studentId, level } = this.props;
    return (
      <div>
        <Row gutter={10}>
          <Col span={16}>
            <span>
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
              dataSource={this.state.spps}
              style={{ marginTop: 10 }}
              rowKey="id"
              loading={this.state.loading}
              onChange={this.pageChanged}
              size="small"
            >
              <Column
                title="Paid"
                dataIndex="paid"
                render={(text, record) => (
                  <span>
                    <Checkbox checked={record.paid} />
                  </span>
                )}
              />
              <Column
                title="Payment Date"
                dataIndex="paymentDate"
                key="paymentDate"
                render={(text, record) => (
                  <span>
                    {moment(text).format('DD/MM/YYYY')}
                  </span>
                )}
              />
              <Column
                title="Description"
                dataIndex="description"
                key="description"
              />
              <Column
                title="File"
                render={(text, record) => {
                  if (record.fileId) {
                    return (
                      <div>
                        <span style={{ marginRight: 5 }}>
                          <Popconfirm
                            title={'Are you sure to remove file'}
                            onConfirm={() => this.deleteSppFile(record)}
                            okText="Yes" cancelText="No"
                          >
                            <Button
                              style={{ border: 0 }}
                              icon="close-circle"
                              shape="circle"
                              size="small"
                            />
                          </Popconfirm>
                        </span>
                        <span>
                          <a target="_blank" href={`${FILES_URL}/students/${record.StudentId}/spp/${record.fileId}.jpg`}>
                            {record.fileId}
                          </a>
                        </span>
                      </div>
                    );
                  }
                  return (<div>No File</div>);
                }}
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
                    <Upload {...getUploadProps(record.id, () => (this.fetchSpps()))} showUploadList={false}>
                      <Button
                        icon="upload"
                        size="small"
                        style={{ marginRight: 5 }}
                      />
                    </Upload>
                    <Popconfirm
                      title={`Are you sure delete SPP ${moment(record.paymentDate).format('DD/MM/YYYY')}`}
                      onConfirm={() => this.deleteSpp(record)}
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

        <SppWindow
          studentId={studentId}
          level={level}
          visible={this.state.sppWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          spp={this.state.spp}
          ref={sppWindow => (this.sppWindow = sppWindow)}
        />
      </div>
    );
  }
}

export default SppList;
