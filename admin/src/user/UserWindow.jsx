import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

const USERS_URL = `${process.env.REACT_APP_SERVER_URL}/api/users`;

const FormItem = Form.Item;

class UserWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { user, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const userId = user.id;
        const axiosObj = userId ? axios.put(`${USERS_URL}/${userId}`, values) : axios.post(USERS_URL, values);
        axiosObj.then(() => {
          message.success('Saving user success');
          this.setState({
            saving: false,
          }, () => {
            onSaveSuccess();
          });
        })
          .catch((error) => {
            showError(error);
          });
      });
    });
  }

  render() {
    const { saving } = this.state;
    const { visible, onCancel, form, user } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="User"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Username">
            {getFieldDecorator('username', {
              initialValue: user.username,
              rules: [
                { required: true, message: 'Please input username' },
                { min: 5, message: 'Username minimum length is 5 characters' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: user.name,
              rules: [
                { required: true, message: 'Please input name' },
                { min: 3, message: 'Name minimum length is 3 characters' },
              ],
            })(
              <Input maxLength="100" />,
            )}
          </FormItem>
          <FormItem label="Email">
            {getFieldDecorator('email', {
              initialValue: user.email,
              rules: [
                { type: 'email', message: 'The is not valid E-mail' },
              ],
            })(
              <Input maxLength="100" />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UserWindow);
