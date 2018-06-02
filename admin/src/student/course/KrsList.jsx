import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Checkbox, Row, Col, Upload, message, Popconfirm, notification } from 'antd';
import moment from 'moment';
import showError from '../../utils/ShowError';
import KrsWindow from './KrsWindow';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const KRSS_URL = `${process.env.REACT_APP_SERVER_URL}/api/krss`;
const getKrssUrl = studentId => `${STUDENTS_URL}/${studentId}/krss`;
const FILES_URL = process.env.REACT_APP_FILES_URL;
const Column = Table.Column;

const getUploadProps = (krsId, afterUpload) => (
  {
    name: 'krsFile',
    headers: {
      authorization: 'authorization-text',
    },
    action: `${KRSS_URL}/${krsId}`,
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

class KrsList extends Component {
  state = {
    searchText: '',
    krs: {},
    krss: [],
    loading: false,
    krsWindowVisible: false,
  }
  componentDidMount() {
    this.fetchKrss();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchKrss();
  }

  fetchKrss() {
    const { studentId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getKrssUrl(studentId), { params: {} })
      .then((response) => {
        this.setState({
          krss: response.data,
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

  filterKrss = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchKrss(); });
  }

  deleteKrs(krs) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${KRSS_URL}/${krs.id}`)
      .then(() => {
        message.success('Delete KRS success');
        this.fetchKrss();
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
      });
  }

  deleteKrsFile(krs) {
    const hide = message.loading('Action in progress..', 0);
    axios.put(`${KRSS_URL}/${krs.id}/deletefile`)
      .then(() => {
        message.success('Delete file success');
        this.fetchKrss();
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
      krs: record,
      krsWindowVisible: true,
    }, () => {
      this.krsWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      krsWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchKrss(); });
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
              dataSource={this.state.krss}
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
                            onConfirm={() => this.deleteKrsFile(record)}
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
                          <a target="_blank" href={`${FILES_URL}/students/${record.StudentId}/krs/${record.fileId}.jpg`}>
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
                  <Upload {...getUploadProps(record.id, () => (this.fetchKrss()))} showUploadList={false}>
                      <Button
                        icon="upload"
                        size="small"
                        style={{ marginRight: 5 }}
                      />
                    </Upload>
                    <Popconfirm
                      title={`Are you sure delete KRS ${moment(record.paymentDate).format('DD/MM/YYYY')}`}
                      onConfirm={() => this.deleteKrs(record)}
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

        <KrsWindow
          studentId={studentId}
          level={level}
          visible={this.state.krsWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          krs={this.state.krs}
          ref={krsWindow => (this.krsWindow = krsWindow)}
        />
      </div>
    );
  }
}

export default KrsList;
