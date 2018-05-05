import React, { Component } from 'react';
import { Modal, Form, Checkbox, DatePicker, Button, Row, Col, Tabs, message } from 'antd';
import axios from 'axios';
import moment from 'moment';
import showError from '../utils/ShowError';
import { dateFormat } from '../constant';
import PortofolioTypeSelect from '../settings/portofolio_type/PortofolioTypeSelect';
import PengampuSelect from '../settings/pengampu/PengampuSelect';

const PORTOFOLIOS_URL = `${process.env.REACT_APP_SERVER_URL}/api/portofolios`;
const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getPortofoliosUrl = courseId => `${COURSES_URL}/${courseId}/portofolios`;

const FormItem = Form.Item;
const { TabPane } = Tabs;

class PortofolioWindow extends Component {
  state = {
    saving: false,
  }

  onSave = () => {
    const { courseId, portofolio, onSaveSuccess, form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      this.setState({
        saving: true,
      }, () => {
        const portofolioId = portofolio.id;
        const data = { ...values, portofolioDate: values.portofolioDate.format(dateFormat) };
        const axiosObj = portofolioId ? axios.put(`${PORTOFOLIOS_URL}/${portofolioId}`, data) : axios.post(getPortofoliosUrl(courseId), data);
        axiosObj.then(() => {
          message.success('Saving portofolio success');
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
    const { visible, onCancel, form, portofolio, departmentId } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Portofolio"
        okText="Save"
        footer={[
          <Button key="cancel" onClick={onCancel}>Cancel</Button>,
          <Button key="save" type="primary" loading={saving} onClick={this.onSave}>
            Save
          </Button>,
        ]}
      >
        <Form layout="vertical">
          <FormItem label="Type">
            {getFieldDecorator('portofolioType', {
              initialValue: portofolio.PortofolioType ? portofolio.PortofolioType.id : undefined,
              rules: [
                { required: true, message: 'Please input portofolio type' },
              ],
            })(
              <PortofolioTypeSelect department={departmentId} />,
            )}
          </FormItem>
          <FormItem label="Date">
            {getFieldDecorator('portofolioDate', {
              initialValue: portofolio.portofolioDate ? moment(portofolio.portofolioDate) : undefined,
              rules: [
                { required: true, message: 'Please input date' },
              ],
            })(
              <DatePicker />,
            )}
          </FormItem>
          <FormItem label="">
            {getFieldDecorator('completed', {
              initialValue: portofolio.completed,
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

export default Form.create()(PortofolioWindow);
