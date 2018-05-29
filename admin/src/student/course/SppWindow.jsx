import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker, Checkbox, Button, message } from 'antd';
import moment from 'moment';
import axios from 'axios';

import { dateFormat } from '../../constant';
import showError from '../../utils/ShowError';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const SPPS_URL = `${process.env.REACT_APP_SERVER_URL}/api/spps`;
const getSppsUrl = studentId => `${STUDENTS_URL}/${studentId}/spps`;

const FormItem = Form.Item;
const { TextArea } = Input;

class SppWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { spp, onSaveSuccess, form, studentId, level } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const paymentDate = values.paymentDate.format(dateFormat);
      const data = { ...values, paymentDate, level };
      this.setState({
        saving: true,
      }, () => {
        const sppId = spp.id;
        const axiosObj = sppId ? axios.put(`${SPPS_URL}/${sppId}`, data) : axios.post(getSppsUrl(studentId), data);
        axiosObj.then(() => {
          message.success('Saving SPP success');
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
    const { visible, onCancel, form, spp } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Spp"
        okText="Save"
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>Close</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Payment Date">
            {getFieldDecorator('paymentDate', {
              initialValue: spp.paymentDate ? moment(spp.paymentDate) : undefined,
              rules: [
                { required: true, message: 'Please input payment date' },
              ],
            })(
              <DatePicker />,
            )}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description', {
              initialValue: spp.description,
            })(
              <TextArea rows={2} maxLength={500} />,
            )}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('paid', {
              initialValue: spp.paid,
              valuePropName: 'checked',
            })(
              <Checkbox>Paid</Checkbox>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(SppWindow);
