import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Row, Col, message, Popconfirm, Tag } from 'antd';
import numeral from 'numeral';
import DepartmentSelect from '../../settings/department/DepartmentSelect';
import showError from '../../utils/ShowError';

const ROTATIONS_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/rotations`;
const ROTATIONS_DOWNLOAD_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/rotations/download`;
const Column = Table.Column;

const getCriteriaByScore = (scores) => {
  const score1Arr = scores.filter(score => score.ScoreType.code === 'PRETEST');
  const score1 = score1Arr.length > 0 ? score1Arr[0].scoreValue : null;
  const score1Percentage = score1 ? score1 * 0 : null;

  const score2Arr = scores.filter(score => score.ScoreType.code === 'CASEREPORT');
  const score2 = score2Arr.length > 0 ? score2Arr[0].scoreValue : null;
  const score2Percentage = score2 ? score2 * 0.1 : null;

  const score3Arr = scores.filter(score => score.ScoreType.code === 'WEEKLYDISCUSSION');
  const score3 = score3Arr.length > 0 ? score3Arr[0].scoreValue : null;
  const score3Percentage = score3 ? score3 * 0.2 : null;

  const score4Arr = scores.filter(score => score.ScoreType.code === 'CASETEST');
  const score4 = score4Arr.length > 0 ? score4Arr[0].scoreValue : null;
  const score4Percentage = score4 ? score4 * 0.35 : null;

  const score5Arr = scores.filter(score => score.ScoreType.code === 'POSTTEST');
  const score5 = score5Arr.length > 0 ? score5Arr[0].scoreValue : null;
  const score5Percentage = score5 ? score5 * 0.35 : null;

  const totalPercentage = score1Percentage + score2Percentage + score3Percentage
  + score4Percentage + score5Percentage;

  const total = score1 + score2 + score3
  + score4 + score5;

  let totalInCriteria = null;
  const totalPercentageRound = totalPercentage; // mathjs.round(totalPercentage, 2);
  if (totalPercentageRound >= 80 && totalPercentageRound <= 100) {
    totalInCriteria = <span style={{ color: '#5093E1' }}>A</span>;
  } else if (totalPercentageRound >= 70 && totalPercentageRound <= 79) {
    totalInCriteria = <span style={{ color: '#50C14E' }}>B</span>;
  } else if (totalPercentageRound >= 60 && totalPercentageRound <= 69) {
    totalInCriteria = <span style={{ color: 'orange' }}>C</span>;
  } else if (totalPercentageRound > 0 && totalPercentageRound <= 59) {
    totalInCriteria = <span style={{ color: 'red' }}>E</span>;
  } else if (totalPercentageRound <= 0) {
    totalInCriteria = <span style={{ color: 'gray' }}>-</span>;
  }

  return <span><Tag>{numeral(total).format('0,0.00')}</Tag> <Tag>{`${numeral(totalPercentage).format('0,0.00')} %`}</Tag> <Tag>{totalInCriteria}</Tag></span>;
};

class RotationList extends Component {
  state = {
    searchText: '',
    searchDepartment: '',
    rotation: {},
    rotations: [],
    loading: false,
    count: 0,
    currentPage: 1,
    pageSize: 10,
    rotationWindowVisible: false,
  }
  componentDidMount() {
    this.fetchRotations();
  }

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
    });
  }

  onDepartmentSearchChange = (e) => {
    this.setState({
      searchDepartment: e,
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchRotations();
  }

  fetchRotations() {
    this.setState({
      loading: true,
    });
    axios.get(ROTATIONS_URL, { params: {
      searchText: this.state.searchText,
      searchDepartment: this.state.searchDepartment,
      currentPage: this.state.currentPage,
      pageSize: this.state.pageSize,
    } })
      .then((response) => {
        this.setState({
          rotations: response.data.rows,
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

  filterRotations = () => {
    this.setState({
      currentPage: 1,
    }, () => { this.fetchRotations(); });
  }

  deleteRotation(rotation) {
    const hide = message.loading('Action in progress..', 0);
    axios.delete(`${ROTATIONS_URL}/${rotation.id}`)
      .then(() => {
        message.success('Delete rotation success');
        this.fetchRotations();
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
      rotation: record,
      rotationWindowVisible: true,
    }, () => {
      this.rotationWindow.resetFields();
    });
  }

  closeEditWindow = () => {
    this.setState({
      rotationWindowVisible: false,
    });
  }

  pageChanged = (pagination) => {
    const page = pagination.current;
    this.setState({
      currentPage: page,
    }, () => { this.fetchRotations(); });
  }

  download = () => {
    axios.get(ROTATIONS_DOWNLOAD_URL, { responseType: 'blob', params: {
      searchText: this.state.searchText,
      searchDepartment: this.state.searchDepartment,
    } })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'rotation.xlsx');
        document.body.appendChild(link);
        link.click();
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

  render() {
    return (
      <div>
        <Row gutter={10}>
          <Col span={6}>
            <Input
              value={this.state.searchText}
              onChange={this.onSearchChange}
              placeholder="Name or SID"
              maxLength="50"
            />
          </Col>
          <Col span={4}>
            <DepartmentSelect
              level={-1}
              onChange={this.onDepartmentSearchChange}
            />
          </Col>
          <Col span={8}>
            <span>
              <Button
                shape="circle"
                icon="search"
                onClick={this.filterRotations}
                style={{ marginRight: 15 }}
              />
              <Button
                type="primary"
                shape="circle"
                icon="plus"
                onClick={() => this.openEditWindow({})}
              />
              <Button
                shape="circle"
                icon="download"
                onClick={() => this.download({})}
                style={{ marginLeft: 10 }}
              />
            </span>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              dataSource={this.state.rotations}
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
                title="Name"
                dataIndex="Student.name"
              />
              <Column
                title="Old SID"
                dataIndex="Student.oldSid"
              />
              <Column
                title="New SID"
                dataIndex="Student.newSid"
              />
              <Column
                title="Department"
                dataIndex="Department.name"
              />
              <Column
                title="Hospital"
                dataIndex="hospital1.name"
              />
              <Column
                title="Clinic"
                dataIndex="clinic.name"
              />
              <Column
                title="Tutor"
                dataIndex="adviser.name"
              />
              <Column
                title="Examiner"
                dataIndex="examiner.name"
              />
              <Column
                title="Score"
                dataIndex="score"
                render={(columnText, record) => {
                  return getCriteriaByScore(record.Scores);
                }}
              />
            </Table>
          </Col>
        </Row>
      </div>
    );
  }
}

export default RotationList;
