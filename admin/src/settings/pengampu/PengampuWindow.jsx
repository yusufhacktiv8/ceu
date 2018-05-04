import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';
import DepartmentSelect from '../department/DepartmentSelect';

const PENGAMPUS_URL = `${process.env.REACT_APP_SERVER_URL}/api/pengampus`;

const FormItem = Form.Item;

class PengampuWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { pengampu, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const pengampuId = pengampu.id;
        const axiosObj = pengampuId ? axios.put(`${PENGAMPUS_URL}/${pengampuId}`, values) : axios.post(PENGAMPUS_URL, values);
        axiosObj.then(() => {
          message.success('Saving pengampu success');
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
    const { visible, onCancel, form, pengampu } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Pengampu"
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
              initialValue: pengampu.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: pengampu.name,
              rules: [
                { required: true, message: 'Please input name' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
          <FormItem label="Department">
            {getFieldDecorator('department', {
              initialValue: pengampu.Department ? String(pengampu.Department.id) : undefined,
              rules: [
                { required: true, message: 'Please input department' },
              ],
            })(
              <DepartmentSelect level={-1} />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(PengampuWindow);
