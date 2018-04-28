import React, { Component } from 'react';
import { Modal, Form, InputNumber, Button, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';
import DepartmentSelect from '../settings/department/DepartmentSelect';

const HOSPITAL_DEPARTMENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/hospitaldepartments`;

const FormItem = Form.Item;

class HospitalDepartmentWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { hospitalDepartment, hospitalId, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const hospitalDepartmentId = hospitalDepartment.id;
        const data = { ...values, hospital: hospitalId };
        const axiosObj = hospitalDepartmentId ? axios.put(`${HOSPITAL_DEPARTMENTS_URL}/${hospitalDepartmentId}`, data) : axios.post(HOSPITAL_DEPARTMENTS_URL, data);
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
        title="Hospital Department"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Department">
            {getFieldDecorator('department', {
              initialValue: hospitalDepartment.Department ? String(hospitalDepartment.Department.id) : undefined,
              rules: [
                { required: true, message: 'Please input department' },
              ],
            })(
              <DepartmentSelect level={-1} />,
            )}
          </FormItem>
          <FormItem label="Quota">
            {getFieldDecorator('quota', {
              initialValue: hospitalDepartment.quota,
              rules: [
                { required: true, message: 'Please input quota' },
              ],
            })(
              <InputNumber min={1} max={1000} />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(HospitalDepartmentWindow);
