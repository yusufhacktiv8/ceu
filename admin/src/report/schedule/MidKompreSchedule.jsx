import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Input, Table, Button, DatePicker, Row, Col, message, Modal, Icon } from 'antd';
import showError from '../../utils/ShowError';
import ScoreWindow from '../../student/ukmppd/ScoreWindow';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

const MIDKOMPRE_SCHEDULE_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/midkompreschedule`;
const Column = Table.Column;

class MidKompreSchedule extends Component {
  state = {
    searchText: '',
    preTests: [],
    selectedRowKeys: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    exportWindowVisible: false,
    saving: false,
    studentId: 0,
    score: { KompreType: {} },
  }
  componentDidMount() {
    this.fetchMidKompreSchedule();
  }

  onRangeChange = (e) => {
    this.setState({
      dateRange: e,
    });
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchMidKompreSchedule();
  }

  fetchMidKompreSchedule() {
    this.setState({
      loading: true,
    });
    axios.get(MIDKOMPRE_SCHEDULE_URL, { params: {
      searchText: this.state.searchText,
      dateRange: this.state.dateRange,
      start: (this.state.currentPage - 1) * this.state.pageSize,
      count: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          preTests: response.data.rows,
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

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchMidKompreSchedule(); });
  }

  rowKeysChanged = (rowKeys) => {
    this.setState({
      selectedRowKeys: rowKeys,
    });
  }

  confirmDelete = () => {
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys.length === 0) {
      message.error('No data to do action');
      return;
    }
    const onOk = () => {
      const axiosObj = axios.put(MIDKOMPRE_SCHEDULE_URL, { kompreIds: selectedRowKeys });
      axiosObj.then(() => {
        message.success('Remove student from mid kompre schedule success');
        this.fetchMidKompreSchedule();
      })
        .catch((error) => {
          showError(error);
        });
    };

    confirm({
      title: 'Do you want remove students from mid kompre schedule?',
      content: 'This action cannot be undone',
      onOk,
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  openEditWindow = (record) => {
    this.setState({
      score: { ...record, KompreType: { id: record.KompreTypeId } },
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
    const { selectedRowKeys } = this.state;
    const { rowKeysChanged } = this;
    const rowSelection = {
      type: 'checkbox',
      selectedRowKeys,
      onChange: (rowKeys, selectedRows) => {
        rowKeysChanged(rowKeys, selectedRows);
      },
    };
    return (
      <div>
        <Row gutter={10}>
          <Col span={6}>
            <RangePicker
              value={this.state.dateRange}
              onChange={(date) => {
                this.onRangeChange(date);
              }}
            />
          </Col>
          <Col span={7}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Name or SID"
              maxLength="50"
            />
          </Col>
          <Col span={10}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={() => this.fetchMidKompreSchedule()}
                style={{ marginRight: 5 }}
              />
              <Button
                type="danger"
                shape="circle"
                icon="delete"
                onClick={() => this.confirmDelete()}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.preTests}
              style={{ marginTop: 20, width: '100%' }}
              rowKey="id"
              loading={this.state.loading}
              pagination={{
                total: this.state.count,
                current: this.state.currentPage,
                pageSize: this.state.pageSize,
              }}
              onChange={this.pageChanged}
              rowSelection={rowSelection}
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
                title="Score"
                dataIndex="score"
              />
              <Column
                title="Name"
                dataIndex="Student.name"
              />
              <Column
                title="Mid Kompre Date"
                dataIndex="kompreDate"
                key="kompreDate"
                render={(text, record) => (
                  <span>
                    {moment(text).format('DD/MM/YYYY')}
                  </span>
                )}
              />
              <Column
                title="Selected"
                dataIndex="selected"
                key="selected"
                render={(text, record) => (
                  <span>
                    {record.selected ? <Icon type="check-circle" style={{ color: 'green', fontSize: 20 }} /> : null}
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
                  </span>
                )}
              />
            </Table>
          </Col>
        </Row>

        <ScoreWindow
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

export default MidKompreSchedule;
