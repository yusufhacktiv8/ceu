import React, { Component } from 'react';
import { Modal, Form, InputNumber, DatePicker, Checkbox, Button, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import showError from '../../utils/ShowError';
import UkmppdTypeSelect from './UkmppdTypeSelect';
import { dateFormat } from '../../constant';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const SCORES_URL = `${process.env.REACT_APP_SERVER_URL}/api/ukmppds`;
const getScoresUrl = studentId => `${STUDENTS_URL}/${studentId}/ukmppds`;

const FormItem = Form.Item;

class ScoreWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { studentId, score, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const scoreId = score.id;
        values.testDate = values.testDate.format(dateFormat);
        const axiosObj = scoreId ? axios.put(`${SCORES_URL}/${scoreId}`, values) : axios.post(getScoresUrl(studentId), values);
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
    const { visible, onCancel, form, score } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        visible={visible}
        title="UKMPPD Score"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Score">
            {getFieldDecorator('score', {
              initialValue: score.score,
              rules: [
                { required: true, message: 'Please input score' },
              ],
            })(
              <InputNumber min={0} max={100} />,
            )}
          </FormItem>
          <FormItem label="Type">
            {getFieldDecorator('testType', {
              initialValue: score.testType,
              rules: [
                { required: true, message: 'Please input type' },
              ],
            })(
              <UkmppdTypeSelect />,
            )}
          </FormItem>
          <FormItem label="Date">
            {getFieldDecorator('testDate', {
              initialValue: score.testDate ? moment(score.testDate) : undefined,
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
