import React, { Component } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';
import showError from '../../utils/ShowError';

const TUTORS_URL = `${process.env.REACT_APP_SERVER_URL}/api/tutors`;

const FormItem = Form.Item;

class TutorWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { tutor, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const tutorId = tutor.id;
        const axiosObj = tutorId ? axios.put(`${TUTORS_URL}/${tutorId}`, values) : axios.post(TUTORS_URL, values);
        axiosObj.then(() => {
          message.success('Saving tutor success');
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
    const { visible, onCancel, form, tutor } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Tutor"
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
              initialValue: tutor.code,
              rules: [
                { required: true, message: 'Please input code' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Name">
            {getFieldDecorator('name', {
              initialValue: tutor.name,
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

export default Form.create()(TutorWindow);
