import React from 'react';
import { Form, Input } from 'antd';

const FormItem = Form.Item;

const InfoForm = ({ form }) => {
  const { getFieldDecorator, title } = form;
  return (
    <Form layout="vertical">
      <FormItem label="Title">
        {getFieldDecorator('title', {
          initialValue: title,
          rules: [
            { required: true, message: 'Please input title' },
          ],
        })(
          <Input maxLength="50" />,
        )}
      </FormItem>
    </Form>
  );
};

export default Form.create()(InfoForm);
