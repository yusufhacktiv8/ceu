import React, { Component } from 'react';
import { Modal, Form, Input, Select, Button, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

const HOSPITALS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitals`;

const FormItem = Form.Item;
const { Option } = Select;

class HospitalWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { hospital, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const hospitalId = hospital.id;
        const axiosObj = hospitalId ? axios.put(`${HOSPITALS_URL}/${hospitalId}`, values) : axios.post(HOSPITALS_URL, values);
        axiosObj.then(() => {
          message.success('Saving hospital success');
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
    const { visible, onCancel, form, hospital } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Hospital"
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
              initialValue: hospital.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: hospital.name,
              rules: [
                { required: true, message: 'Please input name' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
          <FormItem label="Type">
            {getFieldDecorator('hospitalType', {
              initialValue: hospital.hospitalType ? `${hospital.hospitalType}` : undefined,
              rules: [
                { required: true, message: 'Please input type' },
              ],
            })(
              <Select
                placeholder="Select Type"
                style={{ width: '50%' }}
              >
                <Option key="1" value="1">Hospital</Option>
                <Option key="2" value="2">Clinic</Option>
              </Select>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(HospitalWindow);
