import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

const CHANGE_PASSWORD_URL = `${process.env.REACT_APP_SERVER_URL}/api/changepassword`;

const FormItem = Form.Item;
const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');

class ChangePasswordWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { user, onSaveSuccess, form } = this.props;
    form.validateFields({ force: true }, (err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const userId = user.id;
        const axiosObj = axios.put(`${CHANGE_PASSWORD_URL}/${userId}`, values);
        axiosObj.then(() => {
          message.success('Change password success');
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

  retypePasswordValidator = (rule, value, callback) => {
    const { form } = this.props;
    const newPasswordFieldError = form.getFieldError('newPassword');
    if (!newPasswordFieldError) {
      const newPasswordFieldValue = form.getFieldValue('newPassword');
      if (value !== newPasswordFieldValue) {
        callback('Password is not same');
      }
    }
    callback();
  }

  render() {
    const { saving } = this.state;
    const { visible, onCancel, user, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        visible={visible}
        title={`Change Password - ${user.username}`}
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="New Password" style={{ whiteSpace: 'normal' }}>
            {getFieldDecorator('newPassword', {
              initialValue: '',
              rules: [
                { required: true, message: 'Please input new password' },
                { pattern: strongRegex, message: 'Password must contain lowercase, uppercase, numeric and special character. \n Must have minimum 8 characters length.' },
              ],
            })(
              <Input type="password" maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Retype Password">
            {getFieldDecorator('retypePassword', {
              initialValue: '',
              rules: [
                { required: true, message: 'Please input retype password' },
                { validator: this.retypePasswordValidator },
              ],
            })(
              <Input type="password" maxLength="30" />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ChangePasswordWindow);
