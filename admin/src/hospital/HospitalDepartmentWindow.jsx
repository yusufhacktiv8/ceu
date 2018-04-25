import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';

const HOSPITAL_DEPARTMENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitalDepartments`;

const FormItem = Form.Item;

class HospitalDepartmentWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { hospitalDepartment, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const hospitalDepartmentId = hospitalDepartment.id;
        const axiosObj = hospitalDepartmentId ? axios.put(`${HOSPITAL_DEPARTMENTS_URL}/${hospitalDepartmentId}`, values) : axios.post(HOSPITAL_DEPARTMENTS_URL, values);
        axiosObj.then(() => {
          message.success('Saving hospitalDepartment success');
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
    const { visible, onCancel, form, hospitalDepartment } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="HospitalDepartment"
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
              initialValue: hospitalDepartment.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: hospitalDepartment.name,
              rules: [
                { required: true, message: 'Please input name' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(HospitalDepartmentWindow);
