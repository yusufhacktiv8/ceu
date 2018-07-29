import React, { Component } from 'react';
import { Form, DatePicker, Checkbox, Button, Tabs, Spin, Icon, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import showError from '../../utils/ShowError';

const FormItem = Form.Item;
const { TabPane } = Tabs;

const YUDISIUM_CHECKLISTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/yudisiumchecklists`;

class Yudisium2Page extends Component {
  state = {
    yudisium: {},
    loading: false,
    loadingYudisium: false,
    saving: false,
  }

  componentDidMount() {
    this.fetchYudisium();
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

  render() {
    const { form } = this.props;
    const { yudisium, loadingYudisium, saving } = this.state;
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
        <TabPane tab="Schedule" key="1">
          <Spin indicator={antIcon} spinning={loadingYudisium}>
            <Form layout="vertical">
              <FormItem label="Yudisium Date">
                {getFieldDecorator('yudisiumDateB', {
                  initialValue: yudisium.yudisiumDateB ? moment(yudisium.yudisiumDateB) : undefined,
                })(
                  <DatePicker />,
                )}
              </FormItem>
              <FormItem label="Completed">
                {getFieldDecorator('completedB', {
                  initialValue: yudisium.completedB,
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

export default Form.create()(Yudisium2Page);
