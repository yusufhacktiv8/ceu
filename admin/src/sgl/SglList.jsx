import React, { Component } from 'react';
import axios from 'axios';
import { Table, Checkbox, Button, Row, Col, Popconfirm, message } from 'antd';
import moment from 'moment';
import SglWindow from './SglWindow';
import showError from '../utils/ShowError';

const Column = Table.Column;
const SGLS_URL = `${process.env.REACT_APP_SERVER_URL}/api/sgls`;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getSglsUrl = courseId => `${COURSES_URL}/${courseId}/sgls`;

class SglList extends Component {
  state = {
    sgl: {},
    sgls: [],
    loading: false,
  }

  componentDidMount() {
    this.fetchSgls();
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchSgls();
  }

  fetchSgls() {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getSglsUrl(courseId), { params: {} })
      .then((response) => {
        this.setState({
          sgls: response.data,
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

  openEditWindow = (record) => {
    this.setState({
      sgl: record,
      sglWindowVisible: true,
    }, () => {
      this.sglWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      sglWindowVisible: false,
    });
  }

  deleteSgl(sgl) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${SGLS_URL}/${sgl.id}`)
      .then(() => {
        message.success('Delete sgl success');
        this.fetchSgls();
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
      });
  }

  render() {
    return (
      <div style={{ marginTop: -15, overflow: 'scroll', height: 400 }}>
        <Row gutter={10} style={{ marginTop: 10 }}>
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
        <Table
          dataSource={this.state.sgls}
          style={{ marginTop: 10 }}
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
            dataIndex="SglType.name"
            key="type"
          />
          <Column
            title="Date"
            dataIndex="sglDate"
            key="sglDate"
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
                  title={`Are you sure delete sgl ${record.SglType.name}`}
                  onConfirm={() => this.deleteSgl(record)}
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

        <SglWindow
          visible={this.state.sglWindowVisible}
          courseId={this.props.courseId}
          departmentId={this.props.departmentId}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          sgl={this.state.sgl}
          ref={sglWindow => (this.sglWindow = sglWindow)}
        />
      </div>
    );
  }
}

export default SglList;
