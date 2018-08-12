import React, { Component } from 'react';
import { Form, DatePicker, Checkbox, Button, Tabs, Table, Spin, Icon, Row, Col, Popconfirm, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import numeral from 'numeral';
import showError from '../../utils/ShowError';
import ScoreWindow from '../ukmppd/ScoreWindow';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Column } = Table;

const YUDISIUM_CHECKLISTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/yudisiumchecklists`;
const ASSISTANCE_ATTENDANCE_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistanceattendance`;
const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const SCORES_URL = `${process.env.REACT_APP_SERVER_URL}/api/kompres`;
const getScoresUrl = studentId => `${STUDENTS_URL}/${studentId}/kompres`;

class AssistancePage extends Component {
  state = {
    yudisium: {},
    assistanceAttendance: {},
    portofolioCompletions: [],
    loading: false,
    loadingYudisium: false,
    loadingAssistanceAttendance: false,
    saving: false,
    scores: [],
    score: {},
    assistances: [],
    attendances: [],
  }

  componentDidMount() {
    this.fetchYudisium();
    this.fetchPortofolioCompletions();
    this.fetchScores();
    this.fetchAssistanceAttendance();
  }

  onSubmit = () => {
    const { form } = this.props;
    const { yudisium } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({ saving: true });
        const axiosObj = axios.put(`${YUDISIUM_CHECKLISTS_URL}/${yudisium.id}`, values);
        axiosObj.then(() => {
          message.success('Saving yudisium success');
          this.setState({
            saving: false,
          });
        })
          .catch((error) => {
            this.setState({
              saving: false,
            });
            showError(error);
          });
      }
    });
  }

  onSaveSuccess = () => {
    this.closeEditWindow();
    this.fetchScores();
  }

  fetchYudisium() {
    const { studentId } = this.props;
    this.setState({
      loadingYudisium: true,
    });
    axios.get(`${YUDISIUM_CHECKLISTS_URL}/findbystudent/${studentId}`, { params: {} })
      .then((response) => {
        this.setState({
          yudisium: response.data,
          loadingYudisium: false,
        });
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        this.setState({
          loadingYudisium: false,
        });
      });
  }

  fetchPortofolioCompletions() {
    const { studentId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(`${YUDISIUM_CHECKLISTS_URL}/portofolios/${studentId}`, { params: { level: 2 } })
      .then((response) => {
        this.setState({
          portofolioCompletions: response.data,
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

  fetchScores = () => {
    const { studentId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getScoresUrl(studentId), { params: {} })
      .then((response) => {
        this.setState({
          scores: response.data,
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

  fetchAssistanceAttendance() {
    const { studentId } = this.props;
    this.setState({
      loadingAssistanceAttendance: true,
    });
    axios.get(`${ASSISTANCE_ATTENDANCE_URL}/${studentId}`, { params: {} })
      .then((response) => {
        const { assistances, attendances } = response.data;
        this.setState({
          attendances,
          assistances,
          loadingAssistanceAttendance: false,
        });
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        this.setState({
          loadingAssistanceAttendance: false,
        });
      });
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

  closeEditWindow = () => {
    this.setState({
      scoreWindowVisible: false,
    });
  }

  render() {
    const { form, studentId } = this.props;
    const {
      yudisium,
      portofolioCompletions,
      loadingYudisium,
      loading,
      saving,
      assistances,
      attendances,
      loadingAssistanceAttendance,
    } = this.state;
    const { getFieldDecorator } = form;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    const buttons = [
      <Button loading={saving} style={{ marginLeft: 8 }} key="save" type="primary" size="small" onClick={this.onSubmit}>
        Save
      </Button>,
    ];

    const attendancePercentage = assistances.length > 0 ? (attendances.length / assistances.length) * 100 : 0;

    return (
      <Tabs
        defaultActiveKey="1"
        style={{ marginTop: -10, height: 300, overflow: 'scroll' }}
        tabBarExtraContent={buttons}
      >
        <TabPane tab="Checklist" key="2">
          <Spin indicator={antIcon} spinning={loadingYudisium}>
            <Form layout="vertical">
              <FormItem label="">
                {getFieldDecorator('checklist1B', {
                  initialValue: yudisium.checklist1B,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Bebas Pustaka</Checkbox>,
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('checklist2B', {
                  initialValue: yudisium.checklist2B,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Buku Kontrol</Checkbox>,
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('checklist3B', {
                  initialValue: yudisium.checklist3B,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Rapor</Checkbox>,
                )}
              </FormItem>
            </Form>
          </Spin>
        </TabPane>
        <TabPane tab="Portofolios" key="3">
          <div style={{ marginTop: -15, height: 400 }}>
            <Table
              dataSource={portofolioCompletions}
              style={{ marginTop: 0 }}
              rowKey="id"
              loading={loading}
              size="middle"
            >
              <Column
                title="Title"
                dataIndex="course.title"
              />
              <Column
                title="Department"
                dataIndex="course.Department.name"
              />
              <Column
                title="Total"
                key="total"
                render={(text, record) => (
                  record.portofolios.length
                )}
              />
              <Column
                title="Competed"
                key="completed"
                render={(text, record) => (
                  record.portofolios.length > 0 ?
                    record.portofolios.filter(portofolio => (portofolio.completed)).length :
                    '-'
                )}
              />
              <Column
                title="Completion"
                key="completions"
                render={(text, record) => {
                  if (record.portofolios.length > 0) {
                    const percentage =
                    (record.portofolios.filter(portofolio => (portofolio.completed)).length
                    / record.portofolios.length) * 100;
                    return `${numeral(percentage).format('0,0')}%`;
                  }

                  return '-';
                }}
              />
            </Table>
          </div>
        </TabPane>
        <TabPane tab="Stase kompre" key="4">
          <Spin indicator={antIcon} spinning={loadingYudisium}>
            <FormItem label="">
              {getFieldDecorator('checklist4B', {
                initialValue: yudisium.checklist4B,
                valuePropName: 'checked',
              })(
                <Checkbox>Lulus Stase Kompre</Checkbox>,
              )}
            </FormItem>
            <Table
              dataSource={portofolioCompletions.filter((record) => {
                if (record.portofolios.length > 0) {
                  const totalCompleted =
                  record.portofolios.filter(portofolio => (portofolio.completed)).length;
                  return totalCompleted < record.portofolios.length;
                }
                return true;
              })}
              style={{ marginTop: 0 }}
              rowKey="id"
              loading={loading}
              size="middle"
            >
              <Column
                title="Title"
                dataIndex="course.title"
              />
              <Column
                title="Department"
                dataIndex="course.Department.name"
              />
              <Column
                title="Total"
                key="total"
                render={(text, record) => (
                  record.portofolios.length
                )}
              />
              <Column
                title="Competed"
                key="completed"
                render={(text, record) => (
                  record.portofolios.length > 0 ?
                    record.portofolios.filter(portofolio => (portofolio.completed)).length :
                    '-'
                )}
              />
              <Column
                title="Completion"
                key="completions"
                render={(text, record) => {
                  if (record.portofolios.length > 0) {
                    const percentage =
                    (record.portofolios.filter(portofolio => (portofolio.completed)).length
                    / record.portofolios.length) * 100;
                    return `${numeral(percentage).format('0,0')}%`;
                  }

                  return '-';
                }}
              />
            </Table>
          </Spin>
        </TabPane>
        <TabPane tab="Assistances" key="5">
          <div style={{ marginTop: -15, height: 400 }}>
            <Table
              dataSource={assistances}
              style={{ marginTop: 0 }}
              rowKey="id"
              loading={loading}
              size="middle"
            >
              <Column
                title="Code"
                dataIndex="code"
              />
              <Column
                title="Date"
                dataIndex="eventDate"
                key="eventDate"
                render={(text, record) => (
                  <span>
                    {moment(text).format('DD/MM/YYYY')}
                  </span>
                )}
              />
            </Table>
          </div>
        </TabPane>
        <TabPane tab="Attendance" key="6">
          <Spin indicator={antIcon} spinning={loadingAssistanceAttendance}>
            <div style={{ fontSize: 24, fontWeigth: 'bold' }}>
              {`${numeral(attendancePercentage).format('0,0.00')}%`}
            </div>
            <FormItem label="">
              {getFieldDecorator('assistanceCompleted', {
                initialValue: yudisium.assistanceCompleted,
                valuePropName: 'checked',
              })(
                <Checkbox>Assistance Completed</Checkbox>,
              )}
            </FormItem>
            <Table
              dataSource={attendances}
              style={{ marginTop: 0 }}
              rowKey="id"
              loading={loading}
              size="middle"
            >
              <Column
                title="Code"
                dataIndex="Assistance.code"
              />
              <Column
                title="Date"
                dataIndex="Assistance.eventDate"
                render={(text, record) => (
                  <span>
                    {moment(text).format('DD/MM/YYYY')}
                  </span>
                )}
              />
            </Table>
          </Spin>
        </TabPane>
      </Tabs>
    );
  }
}

export default Form.create()(AssistancePage);
