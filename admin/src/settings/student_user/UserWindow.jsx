import React, { Component } from 'react';
import { Modal, Form, Button, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';
import StudentSearch from '../../student/StudentSearch';
import UserByRoleSelect from './UserByRoleSelect';

const HOSPITAL_USERS_URL = `${process.env.REACT_APP_SERVER_URL}/api/studentusers`;

const FormItem = Form.Item;

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
        const axiosObj = userId ? axios.put(`${HOSPITAL_USERS_URL}/${userId}`, values) : axios.post(HOSPITAL_USERS_URL, values);
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
    const { visible, onCancel, form, user, initialStudent } = this.props;
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
          <FormItem label="User">
            {getFieldDecorator('user', {
              initialValue: user.User ? user.User.id : undefined,
              rules: [
                { required: true, message: 'Please input user' },
              ],
            })(
              <UserByRoleSelect roleCode="STUDENT" />,
            )}
          </FormItem>
          <FormItem label="Student">
            {getFieldDecorator('student', {
              initialValue: user.Student ? String(user.Student.id) : undefined,
              rules: [
                { required: true, message: 'Please input student' },
              ],
            })(
              <StudentSearch initialStudent={initialStudent} />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UserWindow);
