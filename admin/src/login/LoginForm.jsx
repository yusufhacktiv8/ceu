import React from 'react';
import { Form, Icon, Input, Button, Checkbox, notification } from 'antd';
import axios from 'axios';

import constant from '../constant';

const FormItem = Form.Item;

const LOGIN_URL = `${constant.serverUrl}/authenticate`;

class NormalLoginForm extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        axios.post(LOGIN_URL, values)
          .then((response) => {
            const status = response.data.status;
            const token = response.data.token;
            if (typeof (Storage) !== 'undefined') {
              if (status === 'LOGIN_ERROR') {
                notification.error({
                  message: 'Wrong username or password',
                  description: '',
                });
              } else {
                window.sessionStorage.setItem('token', token);
                window.location.href = '/';
              }
            } else {
                alert('Sorry! No Web Storage support..');
            }
          })
          .catch((err2) => {
            let errorMessage = '';
            if (err2.response) {
              if (err2.response.status === 500) {
                errorMessage = 'Ex. wrong username or password';
              } else {
                errorMessage = `Status: ${err.response.status}`;
              }
            } else if (err2.request) {
              errorMessage = 'Login error.';
            } else {
              errorMessage = err.message;
            }
            notification.error({
              message: 'Wrong username or password',
              description: errorMessage,
            });
          });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <div style={{ width: 215, marginLeft: 'auto', marginRight: 'auto', marginBottom: 30 }}>
          <span style={{ fontSize: 14, fontWeight: 'bold', color: '#5093E1', border: '1px dotted silver', borderRadius: 50, padding: 7 }}>
            <span style={{ color: '#5093E1' }}>Clinical Education Unit &trade;</span>
          </span>
        </div>
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Please input username' }],
          })(
            <Input
              prefix={<Icon type="user"style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
              maxLength={30}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password', {
            rules: [{ required: true, message: 'Please input password' }],
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password" placeholder="Password"
              maxLength={30}
            />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('remember', {
            valuePropName: 'checked',
            initialValue: true,
          })(
            <Checkbox>Remember me</Checkbox>
          )}
          <a className="login-form-forgot" href="">Forgot password?</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="">register now!</a>
        </FormItem>
        <div style={{ color: 'silver', fontSize: 12 }}>
          Clinical Education Unit Universitas Muslim Indonesia. © UMI 2018. All rights reserved.
        </div>
      </Form>
    );
  }
}

export default Form.create()(NormalLoginForm);
