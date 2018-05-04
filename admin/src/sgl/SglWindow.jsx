import React, { Component } from 'react';
import { Modal, Form, Input, Button, Tabs, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

const SGLS_URL = `${process.env.REACT_APP_SERVER_URL}/api/sgls`;

const FormItem = Form.Item;
const { TabPane } = Tabs;

class SglWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { sgl, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const sglId = sgl.id;
        const axiosObj = sglId ? axios.put(`${SGLS_URL}/${sglId}`, values) : axios.post(SGLS_URL, values);
        axiosObj.then(() => {
          message.success('Saving sgl success');
          this.setState({
            saving: false,
          }, () => {
            onSaveSuccess();
          });
        })
          .catch((error) => {
            this.setState({
              saving: false,
            });
            showError(error);
          });
      });
    });
  }

  render() {
    const { saving } = this.state;
    const { visible, onCancel, form, sgl } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Sgl"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Tabs
          defaultActiveKey="1"
          style={{ marginTop: -15 }}
        >
          <TabPane tab="Main" key="1">
            <Form layout="vertical">
              <FormItem label="Code">
                {getFieldDecorator('code', {
                  initialValue: sgl.code,
                  rules: [
                    { required: true, message: 'Please input code' },
                  ],
                })(
                  <Input maxLength="30" />,
                )}
              </FormItem>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  initialValue: sgl.name,
                  rules: [
                    { required: true, message: 'Please input name' },
                  ],
                })(
                  <Input maxLength="50" />,
                )}
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab="Tutors" key="2">
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default Form.create()(SglWindow);
