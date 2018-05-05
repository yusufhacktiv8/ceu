import React, { Component } from 'react';
import axios from 'axios';
import { Table, Checkbox, Button, Row, Col, Popconfirm, message } from 'antd';
import moment from 'moment';
import PortofolioWindow from './PortofolioWindow';
import showError from '../utils/ShowError';

const Column = Table.Column;
const PORTOFOLIOS_URL = `${process.env.REACT_APP_SERVER_URL}/api/portofolios`;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getPortofoliosUrl = courseId => `${COURSES_URL}/${courseId}/portofolios`;

class PortofolioList extends Component {
  state = {
    portofolio: {},
    portofolios: [],
    loading: false,
  }

  componentDidMount() {
    this.fetchPortofolios();
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchPortofolios();
  }

  fetchPortofolios() {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getPortofoliosUrl(courseId), { params: {} })
      .then((response) => {
        this.setState({
          portofolios: response.data,
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
      portofolio: record,
      portofolioWindowVisible: true,
    }, () => {
      this.portofolioWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      portofolioWindowVisible: false,
    });
  }

  deletePortofolio(portofolio) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${PORTOFOLIOS_URL}/${portofolio.id}`)
      .then(() => {
        message.success('Delete portofolio success');
        this.fetchPortofolios();
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
          dataSource={this.state.portofolios}
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
            dataIndex="PortofolioType.name"
            key="type"
          />
          <Column
            title="Date"
            dataIndex="portofolioDate"
            key="portofolioDate"
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
                  title={`Are you sure delete portofolio ${record.PortofolioType.name}`}
                  onConfirm={() => this.deletePortofolio(record)}
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

        <PortofolioWindow
          visible={this.state.portofolioWindowVisible}
          courseId={this.props.courseId}
          departmentId={this.props.departmentId}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          portofolio={this.state.portofolio}
          ref={portofolioWindow => (this.portofolioWindow = portofolioWindow)}
        />
      </div>
    );
  }
}

export default PortofolioList;
