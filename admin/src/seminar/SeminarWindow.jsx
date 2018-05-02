import React, { Component } from 'react';
import { Modal, Form, Input, Button, Row, Col, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';
import DepartmentSelect from '../settings/department/DepartmentSelect';
import SeminarTypeSelect from '../settings/seminar_type/SeminarTypeSelect';

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
        const axiosObj = seminarId ? axios.put(`${SEMINARS_URL}/${seminarId}`, values) : axios.post(SEMINARS_URL, values);
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
                  initialValue: seminar.Department ? String(seminar.Department.id) : undefined,
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
                  initialValue: seminar.SeminarType ? String(seminar.SeminarType.id) : undefined,
                  rules: [
                    { required: true, message: 'Please input seminar type' },
                  ],
                })(
                  <SeminarTypeSelect department={form.getFieldValue('department')} />,
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
