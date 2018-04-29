import React, { Component } from 'react';
import { Form, Input, Checkbox, Button, Tabs, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;

class YudisiumPage extends Component {
  state = {
    yudisium: {},
  }

  render() {
    const { form } = this.props;
    const { yudisium } = this.state;
    const { getFieldDecorator } = form;
    return (
      <Tabs
        defaultActiveKey="1"
        style={{ marginTop: -10, height: 300 }}
      >
        <TabPane tab="Checklist" key="1">
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
        </TabPane>
        <TabPane tab="Portofolios" key="2">
        </TabPane>
      </Tabs>
    );
  }
}

export default Form.create()(YudisiumPage);
