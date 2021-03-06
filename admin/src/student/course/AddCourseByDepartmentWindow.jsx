import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker, Button, Row, Col, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';
import DepartmentSelect from '../../settings/department/DepartmentSelect';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const getCourseURL = studentId => `${STUDENTS_URL}/${studentId}/courses`;

const FormItem = Form.Item;

class AddCourseDepartmentWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { studentId, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const valuesWithLevel = { ...values, formType: 'DEPARTMENT' };
        const axiosObj = axios.post(getCourseURL(studentId), valuesWithLevel);
        axiosObj.then(() => {
          message.success('Saving courses success');
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
    const { level, visible, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Add Course by Department"
        okText="Save"
        width={600}
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
              <FormItem label="Department">
                {getFieldDecorator('department', {
                  rules: [
                    { required: true, message: 'Please input department' },
                  ],
                })(
                  <DepartmentSelect level={level} />,
                )}
              </FormItem>
            </Col>
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
