import React, { Component } from 'react';
import { Modal, Form, Input, Checkbox, Button, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';
import DepartmentSelect from '../../settings/department/DepartmentSelect';

const SGL_TYPES_URL = `${process.env.REACT_APP_SERVER_URL}/api/sgltypes`;

const FormItem = Form.Item;

class SglTypeWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { sglType, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const sglTypeId = sglType.id;
        const axiosObj = sglTypeId ? axios.put(`${SGL_TYPES_URL}/${sglTypeId}`, values) : axios.post(SGL_TYPES_URL, values);
        axiosObj.then(() => {
          message.success('Saving sglType success');
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
    const { visible, onCancel, form, sglType } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Sgl Type"
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
              initialValue: sglType.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: sglType.name,
              rules: [
                { required: true, message: 'Please input name' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
          <FormItem label="Department">
            {getFieldDecorator('department', {
              initialValue: sglType.Department ? String(sglType.Department.id) : undefined,
              rules: [
                { required: true, message: 'Please input department' },
              ],
            })(
              <DepartmentSelect level={-1} />,
            )}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('active', {
              initialValue: sglType.active,
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

export default Form.create()(SglTypeWindow);
