import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';
import HospitalSelect from '../../hospital/HospitalSelect';
import DepartmentSelect from '../department/DepartmentSelect';

const DOCENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/docents`;

const FormItem = Form.Item;

class DocentWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { docent, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const docentId = docent.id;
        const axiosObj = docentId ? axios.put(`${DOCENTS_URL}/${docentId}`, values) : axios.post(DOCENTS_URL, values);
        axiosObj.then(() => {
          message.success('Saving docent success');
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
    const { visible, onCancel, form, docent } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Docent"
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
              initialValue: docent.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: docent.name,
              rules: [
                { required: true, message: 'Please input name' },
              ],
            })(
              <Input maxLength="50" />,
            )}
          </FormItem>
          <FormItem label="Hospital">
            {getFieldDecorator('hospital', {
              initialValue: docent.Hospital ? String(docent.Hospital.id) : undefined,
              rules: [
                { required: true, message: 'Please input hospital' },
              ],
            })(
              <HospitalSelect hospitalType={-1} />,
            )}
          </FormItem>
          <FormItem label="Department">
            {getFieldDecorator('department', {
              initialValue: docent.Department ? String(docent.Department.id) : undefined,
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

export default Form.create()(DocentWindow);
