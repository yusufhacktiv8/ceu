import React, { Component } from 'react';
import { Modal, Form, DatePicker, InputNumber, Button, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import showError from '../../../../utils/ShowError';
import ScoreTypeSelect from './ScoreTypeSelect';
import { dateFormat } from '../../../../constant';

const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const SCORES_URL = `${process.env.REACT_APP_SERVER_URL}/api/scores`;
const getScoresUrl = courseId => `${COURSES_URL}/${courseId}/scores`;

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
        const { courseId } = this.props;
        const data = { ...values, scoreDate: values.scoreDate.format(dateFormat) }
        const axiosObj = scoreId ? axios.put(`${SCORES_URL}/${scoreId}`, data) : axios.post(getScoresUrl(courseId), data);
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
          <FormItem label="Score">
            {getFieldDecorator('scoreValue', {
              initialValue: score.scoreValue,
              rules: [
                { required: true, message: 'Please input score' },
              ],
            })(
              <InputNumber min={0} max={100} step={0.1} />,
            )}
          </FormItem>
          <FormItem label="Type">
            {getFieldDecorator('scoreType', {
              initialValue: score.ScoreType ? score.ScoreType.id : undefined,
              rules: [
                { required: true, message: 'Please input type' },
              ],
            })(
              <ScoreTypeSelect />,
            )}
          </FormItem>
          <FormItem label="Date">
            {getFieldDecorator('scoreDate', {
              initialValue: score.scoreDate ? moment(score.scoreDate) : undefined,
              rules: [
                { required: true, message: 'Please input date' },
              ],
            })(
              <DatePicker />,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ScoreWindow);
