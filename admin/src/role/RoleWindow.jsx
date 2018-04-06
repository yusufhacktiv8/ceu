import React from 'react';
import { Modal, Form, Input } from 'antd';

const FormItem = Form.Item;

const RoleWindow = ({ visible, onCancel, onSave, form, role }) => {
  const { getFieldDecorator } = form;

  return (
    <Modal
      visible={visible}
      title="Role"
      okText="Save"
      onCancel={onCancel}
      onOk={onSave}
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
};

export default Form.create()(RoleWindow);
