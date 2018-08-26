import React, { Component } from 'react';
import { Modal, Form, DatePicker, InputNumber, Button, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import showError from '../../utils/ShowError';
import ScoreTypeSelect from '../../student/course/details/score/ScoreTypeSelect';
import DepartmentSelect from '../../settings/department/DepartmentSelect';
import StudentSearch from '../../student/StudentSearch';
import { dateFormat } from '../../constant';

const SCORES_URL = `${process.env.REACT_APP_SERVER_URL}/api/uploadscores`;

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
        const data = { ...values, scoreDate: values.scoreDate.format(dateFormat) }
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
              initialValue: score.Course ? String(score.Course.Student.id) : undefined,
              rules: [
                { required: true, message: 'Please input student' },
              ],
            })(
              <StudentSearch initialStudent={initialStudent} />,
            )}
          </FormItem>
          <FormItem label="Department">
            {getFieldDecorator('department', {
              initialValue: score.Course ? String(score.Course.Department.id) : undefined,
              rules: [
                { required: true, message: 'Please input department' },
              ],
            })(
              <DepartmentSelect level={-1} />,
            )}
          </FormItem>
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
