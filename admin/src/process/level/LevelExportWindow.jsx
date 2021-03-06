import React, { Component } from 'react';
import { Modal, Form, DatePicker, Button, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';
import { dateFormat } from '../../constant';

const EXPORT_TO_PRE_TESTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/reports/levelxpt`;

const FormItem = Form.Item;

class LevelExportWindow extends Component {
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
        const data = { courseIds, midKompreDate: values.midKompreDate.format(dateFormat) };
        const axiosObj = axios.post(EXPORT_TO_PRE_TESTS_URL, data);
        axiosObj.then(() => {
          message.success('Export to mid kompre schedule success');
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
        title="Export To Mid Kompre Schedule"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Export
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Mid Kompre Date">
            {getFieldDecorator('midKompreDate', {
              rules: [
                { required: true, message: 'Please input mid kompre date' },
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

export default Form.create()(LevelExportWindow);
