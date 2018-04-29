import React, { Component } from 'react';
import { Form, Input, Checkbox, Button, Tabs, Table, Spin, Icon, Row, Col, message } from 'antd';
import axios from 'axios';
import numeral from 'numeral';
import showError from '../../utils/ShowError';

const FormItem = Form.Item;
const { TabPane } = Tabs;
const { Column } = Table;

const YUDISIUM_CHECKLISTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/yudisiumchecklists`;

class YudisiumPage extends Component {
  state = {
    yudisium: {},
    portofolioCompletions: [],
    loading: false,
    loadingYudisium: false,
    saving: false,
  }

  componentDidMount() {
    this.fetchYudisium();
    this.fetchPortofolioCompletions();
  }

  onSubmit = () => {
    const { form } = this.props;
    const { yudisium } = this.state;
    this.setState({ saving: true });
    form.validateFields((err, values) => {
      if (!err) {
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

  render() {
    const { form } = this.props;
    const { yudisium, portofolioCompletions, loadingYudisium, loading } = this.state;
    const { getFieldDecorator } = form;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    return (
      <Tabs
        defaultActiveKey="1"
        style={{ marginTop: -10, height: 300 }}
      >
        <TabPane tab="Checklist" key="1">
          <Spin indicator={antIcon} spinning={loadingYudisium}>
            <Form layout="vertical">
              <FormItem label="">
                {getFieldDecorator('checklist1', {
                  initialValue: yudisium.checklist1,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Tanda Tangan Bakordik</Checkbox>,
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('checklist2', {
                  initialValue: yudisium.checklist2,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Tanda Tangan PA</Checkbox>,
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('checklist3', {
                  initialValue: yudisium.checklist3,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Tanda Tangan Ketua PU</Checkbox>,
                )}
              </FormItem>
            </Form>
            <Row>
              <Col span={24}>
                <Button type="primary" onClick={this.onSubmit}>Save</Button>
              </Col>
            </Row>
          </Spin>
        </TabPane>
        <TabPane tab="Portofolios" key="2">
          <Table dataSource={portofolioCompletions} style={{ marginTop: 20 }} rowKey="id" loading={loading} size="middle">
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
        </TabPane>
      </Tabs>
    );
  }
}

export default Form.create()(YudisiumPage);
