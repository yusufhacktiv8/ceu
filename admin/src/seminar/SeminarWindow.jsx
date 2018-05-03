import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, TimePicker, Button, Row, Col, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import showError from '../utils/ShowError';
import { dateFormat } from '../constant';
import DepartmentSelect from '../settings/department/DepartmentSelect';
import SeminarTypeSelect from '../settings/seminar_type/SeminarTypeSelect';
import SupervisorSelect from '../settings/supervisor/SupervisorSelect';

const SEMINARS_URL = `${process.env.REACT_APP_SERVER_URL}/api/seminars`;

const FormItem = Form.Item;

class SeminarWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { seminar, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const seminarId = seminar.id;
        const data = { ...values, eventDate: values.eventDate.format(dateFormat) };
        const axiosObj = seminarId ? axios.put(`${SEMINARS_URL}/${seminarId}`, data) : axios.post(SEMINARS_URL, data);
        axiosObj.then(() => {
          message.success('Saving seminar success');
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
    const { visible, onCancel, form, seminar } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        visible={visible}
        title="Seminar"
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
              initialValue: seminar.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: seminar.name,
              rules: [
                { required: true, message: 'Please input name' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
          <Row gutter={10}>
            <Col span={12}>
              <FormItem label="Department">
                {getFieldDecorator('department', {
                  initialValue: seminar.SeminarType ? String(seminar.SeminarType.DepartmentId) : undefined,
                  rules: [
                    { required: true, message: 'Please input department' },
                  ],
                })(
                  <DepartmentSelect level={-1} />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Seminar Type">
                {getFieldDecorator('seminarType', {
                  initialValue: seminar.SeminarType ? seminar.SeminarType.id : undefined,
                  rules: [
                    { required: true, message: 'Please input seminar type' },
                  ],
                })(
                  <SeminarTypeSelect department={form.getFieldValue('department')} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem label="Duration (Minutes)">
            {getFieldDecorator('duration', {
              initialValue: seminar.duration,
              rules: [
                { required: true, message: 'Please input duration' },
              ],
            })(
              <InputNumber min={1} max={600} />,
            )}
          </FormItem>
          <Row gutter={10}>
            <Col span={12}>
              <FormItem label="Date">
                {getFieldDecorator('eventDate', {
                  initialValue: seminar.eventDate ? moment(seminar.eventDate) : undefined,
                  rules: [
                    { required: true, message: 'Please input date' },
                  ],
                })(
                  <DatePicker />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Time">
                {getFieldDecorator('eventTime', {
                  initialValue: seminar.eventTime ? moment(seminar.eventTime, 'hh:mm:ss a') : undefined,
                  rules: [
                    { required: true, message: 'Please input time' },
                  ],
                })(
                  <TimePicker />,
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}>
              <FormItem label="Speaker">
                {getFieldDecorator('speaker', {
                  initialValue: seminar.speakerId,
                })(
                  <SupervisorSelect />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Moderator">
                {getFieldDecorator('moderator', {
                  initialValue: seminar.moderatorId,
                })(
                  <SupervisorSelect />,
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(SeminarWindow);
