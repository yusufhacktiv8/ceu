import React, { Component } from 'react';
import { Modal, Form, Input, Checkbox, DatePicker, TimePicker, Button, Row, Col, Tabs, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import showError from '../utils/ShowError';
import { dateFormat, timeFormat } from '../constant';
import TutorSelect from '../settings/tutor/TutorSelect';

const ASSISTANCES_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistances`;

const FormItem = Form.Item;
const { TabPane } = Tabs;

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
    const { visible, onCancel, form, assistance, departmentId } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Assistance"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <Tabs
            defaultActiveKey="1"
            style={{ marginTop: -15 }}
          >
            <TabPane tab="Main" key="1">
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
              <Row>
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
            </TabPane>
            <TabPane tab="Tutors" key="2">
              <Row>
                <Col span={16}>
                  <FormItem label="Utama">
                    {getFieldDecorator('mainTutor', {
                      initialValue: assistance.mainTutorId || undefined,
                    })(
                      <TutorSelect />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="">
                    {getFieldDecorator('mainTutorPresent', {
                      initialValue: assistance.mainTutorPresent,
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
                      initialValue: assistance.secondTutorId || undefined,
                    })(
                      <TutorSelect />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="">
                    {getFieldDecorator('secondTutorPresent', {
                      initialValue: assistance.secondTutorPresent,
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
                      initialValue: assistance.thirdTutorId || undefined,
                    })(
                      <TutorSelect />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="">
                    {getFieldDecorator('thirdTutorPresent', {
                      initialValue: assistance.thirdTutorPresent,
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Present</Checkbox>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={16}>
                  <FormItem label="Pendamping">
                    {getFieldDecorator('facilitator', {
                      initialValue: assistance.facilitatorId || undefined,
                    })(
                      <TutorSelect />,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem label="">
                    {getFieldDecorator('facilitatorPresent', {
                      initialValue: assistance.facilitatorPresent,
                      valuePropName: 'checked',
                    })(
                      <Checkbox>Present</Checkbox>,
                    )}
                  </FormItem>
                </Col>
              </Row>
            </TabPane>
          </Tabs>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AssistanceWindow);
