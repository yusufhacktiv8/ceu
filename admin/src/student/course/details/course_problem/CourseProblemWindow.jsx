import React, { Component } from 'react';
import { Modal, Form, Input, DatePicker, Checkbox, Button, message } from 'antd';
import moment from 'moment';
import axios from 'axios';
import showError from '../../../../utils/ShowError';
import CourseProblemTypeSelect from './CourseProblemTypeSelect';

const COURSE_PROBLEMS_URL = `${process.env.REACT_APP_SERVER_URL}/api/courseproblems`
;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getCourseProblemsUrl = courseId => `${COURSES_URL}/${courseId}/courseproblems`;

const FormItem = Form.Item;
const { TextArea } = Input;

class CourseProblemWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { courseId, courseProblem, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const courseProblemId = courseProblem.id;
        const axiosObj = courseProblemId ? axios.put(`${COURSE_PROBLEMS_URL}/${courseProblemId}`, values) : axios.post(getCourseProblemsUrl(courseId), values);
        axiosObj.then(() => {
          message.success('Saving course problem success');
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
    const { visible, onCancel, form, courseProblem } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        visible={visible}
        title="Course Problem"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Title">
            {getFieldDecorator('title', {
              initialValue: courseProblem.title,
              rules: [
                { required: true, message: 'Please input title' },
              ],
            })(
              <Input maxLength="30" />,
            )}
          </FormItem>
          <FormItem label="Description">
            {getFieldDecorator('description', {
              initialValue: courseProblem.description,
              rules: [
                { required: true, message: 'Please input description' },
              ],
            })(
              <TextArea rows={2} maxLength={500} />,
            )}
          </FormItem>
          <FormItem label="Type">
            {getFieldDecorator('courseProblemType', {
              initialValue: courseProblem.CourseProblemType ? courseProblem.CourseProblemType.id : undefined,
              rules: [
                { required: true, message: 'Please input type' },
              ],
            })(
              <CourseProblemTypeSelect rows={2} maxLength={500} />,
            )}
          </FormItem>
          <FormItem label="Date">
            {getFieldDecorator('problemDate', {
              initialValue: courseProblem.problemDate ? moment(courseProblem.problemDate) : undefined,
              rules: [
                { required: true, message: 'Please input date' },
              ],
            })(
              <DatePicker />,
            )}
          </FormItem>
          <FormItem label="Comment">
            {getFieldDecorator('comment', {
              initialValue: courseProblem.comment,
            })(
              <TextArea rows={2} maxLength={500} />,
            )}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('completed', {
              initialValue: courseProblem.completed,
              valuePropName: 'checked',
            })(
              <Checkbox>Completed</Checkbox>,
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(CourseProblemWindow);
