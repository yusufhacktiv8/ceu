import React, { Component } from 'react';
import { Modal, Form, Checkbox, DatePicker, Button, Row, Col, Tabs, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import showError from '../utils/ShowError';
import { dateFormat } from '../constant';
import SglTypeSelect from '../settings/sgl_type/SglTypeSelect';
import PengampuSelect from '../settings/pengampu/PengampuSelect';

const SGLS_URL = `${process.env.REACT_APP_SERVER_URL}/api/sgls`;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getSglsUrl = courseId => `${COURSES_URL}/${courseId}/sgls`;

const FormItem = Form.Item;
const { TabPane } = Tabs;

class SglWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { courseId, sgl, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const sglId = sgl.id;
        const data = { ...values, sglDate: values.sglDate.format(dateFormat) }
        const axiosObj = sglId ? axios.put(`${SGLS_URL}/${sglId}`, data) : axios.post(getSglsUrl(courseId), data);
        axiosObj.then(() => {
          message.success('Saving sgl success');
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
    const { visible, onCancel, form, sgl, departmentId } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Sgl"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Tabs
          defaultActiveKey="1"
          style={{ marginTop: -15 }}
        >
          <TabPane tab="Main" key="1">
            <Form layout="vertical">
              <FormItem label="Type">
                {getFieldDecorator('sglType', {
                  initialValue: sgl.SglType ? sgl.SglType.id : undefined,
                  rules: [
                    { required: true, message: 'Please input sgl type' },
                  ],
                })(
                  <SglTypeSelect department={departmentId} />,
                )}
              </FormItem>
              <FormItem label="Date">
                {getFieldDecorator('sglDate', {
                  initialValue: sgl.sglDate ? moment(sgl.sglDate) : undefined,
                  rules: [
                    { required: true, message: 'Please input date' },
                  ],
                })(
                  <DatePicker />,
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator('completed', {
                  initialValue: sgl.completed,
                  valuePropName: 'checked',
                })(
                  <Checkbox>Completed</Checkbox>,
                )}
              </FormItem>
            </Form>
          </TabPane>
          <TabPane tab="Tutors" key="2">
            <Row>
              <Col span={16}>
                <FormItem label="Utama">
                  {getFieldDecorator('mainTutor', {
                    initialValue: sgl.mainTutorId ? String(sgl.mainTutorId) : undefined,
                  })(
                    <PengampuSelect department={departmentId} />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="">
                  {getFieldDecorator('mainTutorPresent', {
                    initialValue: sgl.mainTutorPresent,
                    valuePropName: 'checked',
                  })(
                    <Checkbox>Present</Checkbox>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem label="Cadangan">
                  {getFieldDecorator('secondTutor', {
                    initialValue: sgl.secondTutorId ? String(sgl.secondTutorId) : undefined,
                  })(
                    <PengampuSelect department={departmentId} />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="">
                  {getFieldDecorator('secondTutorPresent', {
                    initialValue: sgl.secondTutorPresent,
                    valuePropName: 'checked',
                  })(
                    <Checkbox>Present</Checkbox>,
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem label="Siaga">
                  {getFieldDecorator('thirdTutor', {
                    initialValue: sgl.thirdTutorId ? String(sgl.thirdTutorId) : undefined,
                  })(
                    <PengampuSelect department={departmentId} />,
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem label="">
                  {getFieldDecorator('thirdTutorPresent', {
                    initialValue: sgl.thirdTutorPresent,
                    valuePropName: 'checked',
                  })(
                    <Checkbox>Present</Checkbox>,
                  )}
                </FormItem>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default Form.create()(SglWindow);
