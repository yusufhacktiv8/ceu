import React, { Component } from 'react';
import { Modal, Form, Input, Radio, Button, Tabs, message, Row, Col } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';
import LevelSelect from './LevelSelect';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;

class StudentWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { student, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const studentId = student.id;
        const axiosObj = studentId ? axios.put(`${STUDENTS_URL}/${studentId}`, values) : axios.post(STUDENTS_URL, values);
        axiosObj.then(() => {
          message.success('Saving student success');
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
    const { visible, onCancel, form, student = {} } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        width={610}
        visible={visible}
        title="Student"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical" style={{ marginTop: -15 }}>
          <Tabs defaultActiveKey="1" style={{ minHeight: 435 }}>
            <TabPane tab="Main" key="1">
              <Row gutter={10}>
                <Col span={12}>
                  <FormItem label="Old SID">
                    {getFieldDecorator('oldSid', {
                      initialValue: student.oldSid,
                      rules: [
                        { required: true, message: 'Please input old SID' },
                      ],
                    })(
                      <Input maxLength="30" />,
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="New SID">
                    {getFieldDecorator('newSid', {
                      initialValue: student.newSid,
                      rules: [
                        { required: true, message: 'Please input new SID' },
                      ],
                    })(
                      <Input maxLength="30" />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="Name">
                    {getFieldDecorator('name', {
                      initialValue: student.name,
                      rules: [
                        { required: true, message: 'Please input name' },
                      ],
                    })(
                      <Input maxLength="50" />,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="Gender">
                    {getFieldDecorator('gender', {
                      initialValue: student.gender,
                      rules: [
                        { required: true, message: 'Please input gender' },
                      ],
                    })(
                      <RadioGroup>
                        <Radio value="M">Male</Radio>
                        <Radio value="F">Female</Radio>
                      </RadioGroup>,
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={6}>
                  <FormItem label="Level">
                    {getFieldDecorator('level', {
                      initialValue: student.level,
                      rules: [
                        { required: true, message: 'Please input level' },
                      ],
                    })(
                      <LevelSelect />,
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

export default Form.create()(StudentWindow);
