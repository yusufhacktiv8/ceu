import React, { Component } from 'react';
import { Modal, Form, Input, InputNumber, DatePicker, TimePicker, Button, Row, Col, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import showError from '../utils/ShowError';
import { dateFormat, timeFormat } from '../constant';
import DepartmentSelect from '../settings/department/DepartmentSelect';
import AssistanceTopicSelect from '../settings/assistance_topic/AssistanceTopicSelect';
import SupervisorSelect from '../settings/supervisor/SupervisorSelect';

const ASSISTANCES_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistances`;

const FormItem = Form.Item;

class AssistanceWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { assistance, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const assistanceId = assistance.id;
        const data = {
          ...values,
          eventDate: values.eventDate.format(dateFormat),
          eventTime: values.eventTime.format(timeFormat),
        };
        const axiosObj = assistanceId ? axios.put(`${ASSISTANCES_URL}/${assistanceId}`, data) : axios.post(ASSISTANCES_URL, data);
        axiosObj.then(() => {
          message.success('Saving assistance success');
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
    const { visible, onCancel, form, assistance } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        visible={visible}
        title="Assistance"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" topic="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Code">
            {getFieldDecorator('code', {
              initialValue: assistance.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: assistance.name,
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
                  initialValue: assistance.AssistanceTopic ? String(assistance.AssistanceTopic.DepartmentId) : undefined,
                  rules: [
                    { required: true, message: 'Please input department' },
                  ],
                })(
                  <DepartmentSelect level={-1} />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Assistance Topic">
                {getFieldDecorator('assistanceTopic', {
                  initialValue: assistance.AssistanceTopic ? assistance.AssistanceTopic.id : undefined,
                  rules: [
                    { required: true, message: 'Please input assistance topic' },
                  ],
                })(
                  <AssistanceTopicSelect department={form.getFieldValue('department')} />,
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem label="Batch">
            {getFieldDecorator('batch', {
              initialValue: assistance.batch,
              rules: [
                { required: true, message: 'Please input batch' },
              ],
            })(
              <InputNumber min={1} max={4} />,
            )}
          </FormItem>
          <FormItem label="Duration (Minutes)">
            {getFieldDecorator('duration', {
              initialValue: assistance.duration,
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
                  initialValue: assistance.eventDate ? moment(assistance.eventDate) : undefined,
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
                  initialValue: assistance.eventTime ? moment(assistance.eventTime, timeFormat) : undefined,
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
                  initialValue: assistance.speakerId || undefined,
                })(
                  <SupervisorSelect />,
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="Moderator">
                {getFieldDecorator('moderator', {
                  initialValue: assistance.moderatorId || undefined,
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

export default Form.create()(AssistanceWindow);
