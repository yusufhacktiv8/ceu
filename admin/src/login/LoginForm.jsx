import React from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;

const LOGIN_URL = `${process.env.REACT_APP_SERVER_URL}/api/security/signin`;

class NormalLoginForm extends React.Component {
  state = {
    redirectToWorkspace: false,
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        axios.post(LOGIN_URL, values)
          .then((response) => {
            const token = response.data.token;
            if (typeof (Storage) !== 'undefined') {
              window.sessionStorage.setItem('token', token);

              this.setState({
                redirectToWorkspace: true,
              });
            } else {
              message.error('Sorry! No Web Storage support..');
            }
          })
          .catch((errPost) => {
            if (errPost.response) {
              message.error(errPost.response.data);
            } else {
              message.error(errPost.message);
            }
          });
      }
    });
  }
  render() {
    if (this.state.redirectToWorkspace) {
      return <Redirect to="/" />;
    }
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
