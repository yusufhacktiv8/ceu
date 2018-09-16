import React, { Component } from 'react';
import { Modal, Form, DatePicker, InputNumber, Checkbox, Button, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import showError from '../../utils/ShowError';
import KompreTypeSelect from '../../student/yudisium/KompreTypeSelect';
import StudentSearch from '../../student/StudentSearch';
import { dateFormat } from '../../constant';

const SCORES_URL = `${process.env.REACT_APP_SERVER_URL}/api/uploadkompres`;

const FormItem = Form.Item;

class ScoreWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { score, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const scoreId = score.id;
        const data = { ...values, kompreDate: values.kompreDate.format(dateFormat) }
        const axiosObj = scoreId ? axios.put(`${SCORES_URL}/${scoreId}`, data) : axios.post(SCORES_URL, data);
        axiosObj.then(() => {
          message.success('Saving score success');
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
    const { visible, onCancel, form, score, initialStudent } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        visible={visible}
        title="Score"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Student">
            {getFieldDecorator('student', {
              initialValue: score.Student ? String(score.Student.id) : undefined,
              rules: [
                { required: true, message: 'Please input student' },
              ],
            })(
              <StudentSearch initialStudent={initialStudent} />,
            )}
          </FormItem>
          <FormItem label="Score">
            {getFieldDecorator('score', {
              initialValue: score.score,
              rules: [
                { required: true, message: 'Please input score' },
              ],
            })(
              <InputNumber min={0} max={100} step={0.1} />,
            )}
          </FormItem>
          <FormItem label="Type">
            {getFieldDecorator('kompreType', {
              initialValue: score.KompreType ? score.KompreType.id : undefined,
              rules: [
                { required: true, message: 'Please input type' },
              ],
            })(
              <KompreTypeSelect />,
            )}
          </FormItem>
          <FormItem label="Date">
            {getFieldDecorator('kompreDate', {
              initialValue: score.kompreDate ? moment(score.kompreDate) : undefined,
              rules: [
                { required: true, message: 'Please input date' },
              ],
            })(
              <DatePicker />,
            )}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('selected', {
              initialValue: score.selected,
              valuePropName: 'checked',
            })(
              <Checkbox>Selected</Checkbox>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ScoreWindow);
