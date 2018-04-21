import React from 'react';
import { Form, Input, Row, Col } from 'antd';

const FormItem = Form.Item;

const InfoForm = ({ form }) => {
  const { getFieldDecorator, title } = form;
  return (
    <Form layout="vertical">
      <Row>
        <Col span={12}>
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
        </Col>
      </Row>
    </Form>
  );
};

export default Form.create()(InfoForm);
