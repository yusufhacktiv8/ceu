import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

const SEMINARS_URL = `${process.env.REACT_APP_SERVER_URL}/api/seminars`;

const FormItem = Form.Item;

class SeminarWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { seminar, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const seminarId = seminar.id;
        const axiosObj = seminarId ? axios.put(`${SEMINARS_URL}/${seminarId}`, values) : axios.post(SEMINARS_URL, values);
        axiosObj.then(() => {
          message.success('Saving seminar success');
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
    const { visible, onCancel, form, seminar } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Seminar"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Code">
            {getFieldDecorator('code', {
              initialValue: seminar.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: seminar.name,
              rules: [
                { required: true, message: 'Please input name' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(SeminarWindow);
