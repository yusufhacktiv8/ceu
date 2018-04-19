import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker, Button, Row, Col, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const getCourseURL = studentId => `${STUDENTS_URL}/${studentId}/courses`;

const FormItem = Form.Item;

class AddCourseByLevelWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { studentId, level, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const valuesWithLevel = { ...values, level, formType: 'LEVEL' };
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
    const { visible, onCancel, form, level } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title={`Add Course by Level (${level})`}
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
            <Col span={12}>
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
            <Col span={12}>
              <FormItem label="Suffix">
                {getFieldDecorator('suffix', {
                  rules: [
                    { required: true, message: 'Please input suffix' },
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

export default Form.create()(AddCourseByLevelWindow);
