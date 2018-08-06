import React, { Component } from 'react';
import { Modal, Form, Input, Checkbox, Button, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';
import DepartmentSelect from '../../settings/department/DepartmentSelect';

const ASSISTANCE_TOPICS_URL = `${process.env.REACT_APP_SERVER_URL}/api/assistancetopics`;

const FormItem = Form.Item;

class AssistanceTopicWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { assistanceTopic, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const assistanceTopicId = assistanceTopic.id;
        const axiosObj = assistanceTopicId ? axios.put(`${ASSISTANCE_TOPICS_URL}/${assistanceTopicId}`, values) : axios.post(ASSISTANCE_TOPICS_URL, values);
        axiosObj.then(() => {
          message.success('Saving assistanceTopic success');
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
    const { visible, onCancel, form, assistanceTopic } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Seminar Type"
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
              initialValue: assistanceTopic.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: assistanceTopic.name,
              rules: [
                { required: true, message: 'Please input name' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
          <FormItem label="Department">
            {getFieldDecorator('department', {
              initialValue: assistanceTopic.Department ? String(assistanceTopic.Department.id) : undefined,
              rules: [
                { required: true, message: 'Please input department' },
              ],
            })(
              <DepartmentSelect level={-1} />,
            )}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('active', {
              initialValue: assistanceTopic.active,
              valuePropName: 'checked',
            })(
              <Checkbox>Active</Checkbox>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(AssistanceTopicWindow);
