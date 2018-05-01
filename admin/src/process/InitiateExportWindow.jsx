import React, { Component } from 'react';
import { Modal, Form, DatePicker, Button, message } from 'antd';
import axios from 'axios';
import showError from '../utils/ShowError';
import { dateFormat } from '../constant';

const EXPORT_TO_PRE_TESTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/exporttopretest`;

const FormItem = Form.Item;

class InitiateExportWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { courseIds, onSaveSuccess, form } = this.props;
    if (courseIds.length === 0) {
      message.error('No data to export');
      return;
    }
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const data = { courseIds, preTestDate: values.preTestDate.format(dateFormat) };
        const axiosObj = axios.post(EXPORT_TO_PRE_TESTS_URL, data);
        axiosObj.then(() => {
          message.success('Export to pretest success');
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
    const { visible, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        width={500}
        visible={visible}
        title="Export To Pre Test"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Export
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Pre Test Date">
            {getFieldDecorator('preTestDate', {
              rules: [
                { required: true, message: 'Please input pretest date' },
              ],
            })(
              <DatePicker style={{ width: '100%' }} />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(InitiateExportWindow);
