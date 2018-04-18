import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker, Button, Row, Col, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const ROLES_URL = `${process.env.REACT_APP_SERVER_URL}/api/roles`;

const FormItem = Form.Item;

class AddCourseDepartmentWindow extends Component {
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
    const { visible, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Add Course by Department"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Row gutter={10}>
            <Col span={8}>
              <FormItem label="Start Date">
                {getFieldDecorator('startDate', {
                  rules: [
                    { required: true, message: 'Please input start date' },
                  ],
                })(
                  <DatePicker style={{ width: '100%' }} />,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Title">
                {getFieldDecorator('title', {
                  rules: [
                    { required: true, message: 'Please input title' },
                  ],
                })(
                  <Input maxLength="20" />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AddCourseDepartmentWindow);
