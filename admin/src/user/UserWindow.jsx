import React, { Component } from 'react';
import { Modal, Form, Input, Button, Row, Col, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';
import RoleSelect from '../role/RoleSelect';

const USERS_URL = `${process.env.REACT_APP_SERVER_URL}/api/users`;

const FormItem = Form.Item;
const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})');

class UserWindow extends Component {
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

  retypePasswordValidator = (rule, value, callback) => {
    const { form } = this.props;
    const passwordFieldError = form.getFieldError('password');
    if (!passwordFieldError) {
      const passwordFieldValue = form.getFieldValue('password');
      if (value !== passwordFieldValue) {
        callback('Password is not same');
      }
    }
    callback();
  }

  render() {
    const { saving } = this.state;
    const { visible, onCancel, form, user } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
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
                { min: 3, message: 'Username minimum length is 3 characters' },
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
          <Row>
            <Col span={12}>
              <FormItem label="Role">
                {getFieldDecorator('role', {
                  initialValue: user.Role ? user.Role.id : undefined,
                  rules: [
                    { required: true, message: 'Please input role' },
                  ],
                })(
                  <RoleSelect />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
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
            </Col>
          </Row>
          {
            (visible === false || user.id !== undefined) ? null : (
              <FormItem label="Password" style={{ whiteSpace: 'normal' }}>
                {getFieldDecorator('password', {
                  initialValue: '',
                  rules: [
                    { required: true, message: 'Please input password' },
                    { pattern: strongRegex, message: 'Password must contain lowercase, uppercase, numeric and special character. \n Must have minimum 8 characters length.' },
                  ],
                })(
                  <Input type="password" maxLength="30" />,
                )}
              </FormItem>
            )
          }
          {
            (visible === false || user.id !== undefined) ? null : (
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
            )
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UserWindow);
