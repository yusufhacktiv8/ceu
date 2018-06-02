import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker, Checkbox, Button, message } from 'antd';
import moment from 'moment';
import axios from 'axios';

import { dateFormat } from '../../constant';
import showError from '../../utils/ShowError';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const KRSS_URL = `${process.env.REACT_APP_SERVER_URL}/api/krss`;
const getKrssUrl = studentId => `${STUDENTS_URL}/${studentId}/krss`;

const FormItem = Form.Item;
const { TextArea } = Input;

class KrsWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { krs, onSaveSuccess, form, studentId, level } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }

      const paymentDate = values.paymentDate.format(dateFormat);
      const data = { ...values, paymentDate, level };
      this.setState({
        saving: true,
      }, () => {
        const krsId = krs.id;
        const axiosObj = krsId ? axios.put(`${KRSS_URL}/${krsId}`, data) : axios.post(getKrssUrl(studentId), data);
        axiosObj.then(() => {
          message.success('Saving KRS success');
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
    const { visible, onCancel, form, krs } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Krs"
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
              initialValue: krs.paymentDate ? moment(krs.paymentDate) : undefined,
              rules: [
                { required: true, message: 'Please input payment date' },
              ],
            })(
              <DatePicker />,
            )}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description', {
              initialValue: krs.description,
            })(
              <TextArea rows={2} maxLength={500} />,
            )}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('paid', {
              initialValue: krs.paid,
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

export default Form.create()(KrsWindow);
