import React, { Component } from 'react';
import { Form, DatePicker, Checkbox, Button, Tabs, Table, Spin, Icon, Row, Col, Popconfirm, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import numeral from 'numeral';
import showError from '../../utils/ShowError';
import ScoreWindow from './ScoreWindow';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Column } = Table;

const YUDISIUM_CHECKLISTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/yudisiumchecklists`;
const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const SCORES_URL = `${process.env.REACT_APP_SERVER_URL}/api/kompres`;
const getScoresUrl = studentId => `${STUDENTS_URL}/${studentId}/kompres`;

class YudisiumPage extends Component {
  state = {
    yudisium: {},
    portofolioCompletions: [],
    loading: false,
    loadingYudisium: false,
    saving: false,
    scores: [],
    score: {},
  }

  componentDidMount() {
    this.fetchYudisium();
    this.fetchPortofolioCompletions();
    this.fetchScores();
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
    axios.get(`${YUDISIUM_CHECKLISTS_URL}/portofolios/${studentId}`, { params: {} })
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
    const { yudisium, portofolioCompletions, loadingYudisium, loading, saving } = this.state;
    const { getFieldDecorator } = form;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    const buttons = [
      <Button loading={saving} style={{ marginLeft: 8 }} key="save" type="primary" size="small" onClick={this.onSubmit}>
        Save
      </Button>,
    ];

    return (
      <Tabs
        defaultActiveKey="1"
        style={{ marginTop: -10, height: 300, overflow: 'scroll' }}
        tabBarExtraContent={buttons}
      >
        <TabPane tab="Mid kompre" key="1">
          <Row gutter={10} style={{ marginBottom: 10 }}>
            <Col span={16}>
              <span>
                <Button
                  shape="circle"
                  icon="retweet"
                  onClick={this.fetchScores}
                />
                <Button
                  type="primary"
                  shape="circle"
                  icon="plus"
                  onClick={() => this.openEditWindow({
                    KompreType: {
                      id: 2,
                    },
                  })}
                  style={{ marginLeft: 10 }}
                />
              </span>
            </Col>
          </Row>
          <Table
            dataSource={this.state.scores.filter(score =>
              String(score.KompreType.code) === 'K002')}
            style={{ marginTop: 5 }}
            rowKey="id"
            loading={this.state.loading}
            size="small"
          >
            <Column
              title="Selected"
              dataIndex="selected"
              render={(text, record) => (
                <span>
                  <Checkbox checked={record.selected} />
                </span>
              )}
            />
            <Column
              title="Score"
              dataIndex="score"
            />
            <Column
              title="Type"
              dataIndex="KompreType.name"
            />
            <Column
              title="Date"
              dataIndex="kompreDate"
              key="kompreDate"
              render={text => (
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
                    title={'Are you sure delete score?'}
                    onConfirm={() => this.deleteScore(record)}
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
          <ScoreWindow
            studentId={studentId}
            visible={this.state.scoreWindowVisible}
            onSaveSuccess={this.onSaveSuccess}
            onCancel={this.closeEditWindow}
            onClose={this.closeEditWindow}
            score={this.state.score}
            ref={scoreWindow => (this.scoreWindow = scoreWindow)}
          />
        </TabPane>
        <TabPane tab="Checklist" key="2">
          <Spin indicator={antIcon} spinning={loadingYudisium}>
            <Form layout="vertical">
              <FormItem label="">
                {getFieldDecorator('checklist1', {
                  initialValue: yudisium.checklist1,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Rapor</Checkbox>,
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('checklist2', {
                  initialValue: yudisium.checklist2,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Tanda Tangan Ketua CEU</Checkbox>,
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
                key="cmpletions"
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
              {getFieldDecorator('checklist3', {
                initialValue: yudisium.checklist3,
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
                key="cmpletions"
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
        <TabPane tab="Schedule" key="5">
          <Spin indicator={antIcon} spinning={loadingYudisium}>
            <Form layout="vertical">
              <FormItem label="Yudisium Date">
                {getFieldDecorator('yudisiumDate', {
                  initialValue: yudisium.yudisiumDate ? moment(yudisium.yudisiumDate) : undefined,
                })(
                  <DatePicker />,
                )}
              </FormItem>
              <FormItem label="Completed">
                {getFieldDecorator('completed', {
                  initialValue: yudisium.completed,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Yudisium Completed</Checkbox>,
                )}
              </FormItem>
            </Form>
          </Spin>
        </TabPane>
      </Tabs>
    );
  }
}

export default Form.create()(YudisiumPage);
