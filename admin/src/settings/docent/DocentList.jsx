import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm } from 'antd';
import showError from '../../utils/ShowError';
import DocentWindow from './DocentWindow';

const DOCENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/docents`;
const Column = Table.Column;

class DocentList extends Component {
  state = {
    searchText: '',
    docent: {},
    docents: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    docentWindowVisible: false,
  }
  componentDidMount() {
    this.fetchDocents();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchDocents();
  }

  fetchDocents() {
    this.setState({
      loading: true,
    });
    axios.get(DOCENTS_URL, { params: {
      searchText: this.state.searchText,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          docents: response.data.rows,
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

  filterDocents = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchDocents(); });
  }

  deleteDocent(docent) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${DOCENTS_URL}/${docent.id}`)
      .then(() => {
        message.success('Delete docent success');
        this.fetchDocents();
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
      docent: record,
      docentWindowVisible: true,
    }, () => {
      this.docentWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      docentWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchDocents(); });
  }

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={8}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Name or SID"
              maxLength="50"
            />
          </Col>
          <Col span={16}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterDocents}
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
              dataSource={this.state.docents}
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
                title="Code"
                dataIndex="code"
                key="code"
              />
              <Column
                title="Name"
                dataIndex="name"
                key="name"
              />
              <Column
                title="Hospital"
                dataIndex="Hospital.name"
              />
              <Column
                title="Department"
                dataIndex="Department.name"
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
                      title={`Are you sure delete docent ${record.name}`}
                      onConfirm={() => this.deleteDocent(record)}
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

        <DocentWindow
          visible={this.state.docentWindowVisible}
          onSaveSuccess={this.onSaveSuccess}
          onCancel={this.closeEditWindow}
          onClose={this.closeEditWindow}
          docent={this.state.docent}
          ref={docentWindow => (this.docentWindow = docentWindow)}
        />
      </div>
    );
  }
}

export default DocentList;
