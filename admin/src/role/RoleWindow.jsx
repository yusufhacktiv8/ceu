import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

const ROLES_URL = `${process.env.REACT_APP_SERVER_URL}/api/roles`;

const FormItem = Form.Item;

class RoleWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { role, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const roleId = role.id;
        const axiosObj = roleId ? axios.put(`${ROLES_URL}/${roleId}`, values) : axios.post(ROLES_URL, values);
        axiosObj.then(() => {
          message.success('Saving role success');
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
    const { visible, onCancel, form, role } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Role"
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
              initialValue: role.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: role.name,
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

export default Form.create()(RoleWindow);
