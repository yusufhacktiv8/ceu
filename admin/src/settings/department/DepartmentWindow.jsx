import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, Button, Row, Col, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';
import LevelSelect from '../../student/LevelSelect';

const DEPARTMENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/departments`;

const FormItem = Form.Item;

class DepartmentWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { department, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const departmentId = department.id;
        const axiosObj = departmentId ? axios.put(`${DEPARTMENTS_URL}/${departmentId}`, values) : axios.post(DEPARTMENTS_URL, values);
        axiosObj.then(() => {
          message.success('Saving department success');
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
    const { visible, onCancel, form, department } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        visible={visible}
        title="Department"
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
              <FormItem label="Code">
                {getFieldDecorator('code', {
                  initialValue: department.code,
                  rules: [
                    { required: true, message: 'Please input code' },
                  ],
                })(
                  <Input maxLength="30" />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Name">
                {getFieldDecorator('name', {
                  initialValue: department.name,
                  rules: [
                    { required: true, message: 'Please input name' },
                  ],
                })(
                  <Input maxLength="50" />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <FormItem label="Level">
                {getFieldDecorator('level', {
                  initialValue: department.level,
                  rules: [
                    { required: true, message: 'Please input level' },
                  ],
                })(
                  <LevelSelect />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={8}>
              <FormItem label="Duration">
                {getFieldDecorator('duration', {
                  initialValue: department.duration,
                  rules: [
                    { required: true, message: 'Please input duration' },
                  ],
                })(
                  <InputNumber min={1} max={10} />,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Half Duration">
                {getFieldDecorator('halfDuration', {
                  initialValue: department.halfDuration,
                  rules: [
                    { required: true, message: 'Please input half duration' },
                  ],
                })(
                  <InputNumber min={1} max={10} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={8}>
              <FormItem label="Hospital Duration" style={{ whiteSpace: 'normal' }}>
                {getFieldDecorator('duration1', {
                  initialValue: department.duration1,
                  rules: [
                    { required: true, message: 'Please input hospital duration' },
                  ],
                })(
                  <InputNumber min={1} max={10} />,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Clinic Duration" style={{ whiteSpace: 'normal' }}>
                {getFieldDecorator('duration2', {
                  initialValue: department.duration2,
                  rules: [
                    { required: true, message: 'Please input clinic duration' },
                  ],
                })(
                  <InputNumber min={1} max={10} />,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem label="Hospital Duration 2" style={{ whiteSpace: 'normal' }}>
                {getFieldDecorator('duration3', {
                  initialValue: department.duration3,
                  rules: [
                    { required: true, message: 'Please input hospital duration' },
                  ],
                })(
                  <InputNumber min={1} max={10} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <FormItem label="Seminars Count">
                {getFieldDecorator('seminarsCount', {
                  initialValue: department.seminarsCount,
                  rules: [
                    { required: true, message: 'Please input seminars count' },
                  ],
                })(
                  <InputNumber min={1} max={10} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <FormItem label="Color">
                {getFieldDecorator('color', {
                  initialValue: department.color,
                  rules: [
                    { required: true, message: 'Please input color' },
                  ],
                })(
                  <Input maxLength={7} />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(DepartmentWindow);
