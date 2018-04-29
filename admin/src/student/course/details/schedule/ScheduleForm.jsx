import React, { Component } from 'react';
import { Tabs, Form, Input, DatePicker, Button, Row, Col, Spin, Icon, Tag } from 'antd';
import axios from 'axios';
import moment from 'moment';

import HospitalSelect from './HospitalSelect';
import DocentSelect from '../../../../settings/docent/DocentSelect';
import showError from '../../../../utils/ShowError';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const RangePicker = DatePicker.RangePicker;

const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;

class ScheduleForm extends Component {
  state = {
    loading: false,
    course: {},
  }

  componentDidMount() {
    this.fetchCourse();
  }

  fetchCourse() {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(`${COURSES_URL}/${courseId}`, { params: {} })
      .then((response) => {
        this.setState({
          course: response.data,
          loading: false,
        });
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        this.setState({
          loading: false,
        });
      });
  }
  render() {
    const { course } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const {
      planStartDate,
      planEndDate,
      realStartDate,
      realEndDate,
      planStartDate1,
      planEndDate1,
      realStartDate1,
      realEndDate1,
      planStartDate2,
      planEndDate2,
      realStartDate2,
      realEndDate2,
      planStartDate3,
      planEndDate3,
      realStartDate3,
      realEndDate3,
      hospital1,
      clinic,
      adviser,
      examiner,
      dpk,
      StudentId,
      DepartmentId,
    } = course;
    const planDate = [moment(planStartDate), moment(planEndDate)];
    const planDate1 = planStartDate1 && planEndDate1 ? [moment(planStartDate1), moment(planEndDate1)] : [];
    const planDate2 = planStartDate2 && planEndDate2 ? [moment(planStartDate2), moment(planEndDate2)] : [];
    const planDate3 = planStartDate3 && planEndDate3 ? [moment(planStartDate3), moment(planEndDate3)] : [];

    const hospitalName = hospital1 ? hospital1.name : '';
    const clinicName = clinic ? clinic.name : '';
    return (
      <Form>
        <Row>
          <Col span={20}>
            <Tabs defaultActiveKey="1" type="card">
              <TabPane tab="Main" key="1">
                <Row>
                  <Col span={12}>
                    <FormItem label="Plan Date">
                      {getFieldDecorator('planDate', {
                        initialValue: planDate,
                      })(
                        <RangePicker style={{ width: '100%' }} />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col span={6}>
                    <FormItem label="Start Date">
                      {getFieldDecorator('realStartDate', {
                        initialValue: realStartDate ? moment(realStartDate) : undefined,
                      })(
                        <DatePicker style={{ width: '100%' }} />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="End Date">
                      {getFieldDecorator('realEndDate', {
                        initialValue: realEndDate ? moment(realEndDate) : undefined,
                      })(
                        <DatePicker style={{ width: '100%' }} />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Hospital 1" key="2" style={{ height: 370, overflow: 'scroll' }}>
                <div>
                  <Row>
                    <Col span={12}>
                      <FormItem label="Plan Date">
                        {getFieldDecorator('planDate1', {
                          initialValue: planDate1,
                        })(
                          <RangePicker style={{ width: '100%' }} />,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row gutter={10}>
                    <Col span={6}>
                      <FormItem label="Start Date">
                        {getFieldDecorator('realStartDate1', {
                          initialValue: realStartDate1 ? moment(realStartDate1) : undefined,
                        })(
                          <DatePicker style={{ width: '100%' }} />,
                        )}
                      </FormItem>
                    </Col>
                    <Col span={6}>
                      <FormItem label="End Date">
                        {getFieldDecorator('realEndDate1', {
                          initialValue: realEndDate1 ? moment(realEndDate1) : undefined,
                        })(
                          <DatePicker style={{ width: '100%' }} />,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="Hospital 1">
                        {getFieldDecorator('hospital1', {
                          initialValue: hospital1,
                        })(
                          <HospitalSelect
                            studentId={StudentId}
                            departmentId={DepartmentId}
                            hospitalType={1}
                          />,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="Adviser">
                        {getFieldDecorator('adviser', {
                          initialValue: adviser,
                        })(
                          <DocentSelect
                            hospitalId={form.getFieldValue('hospital1') ? form.getFieldValue('hospital1').id : undefined}
                            departmentId={DepartmentId}
                          />,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem label="Examiner">
                        {getFieldDecorator('examiner', {
                          initialValue: examiner,
                        })(
                          <DocentSelect
                            hospitalId={form.getFieldValue('hospital1') ? form.getFieldValue('hospital1').id : undefined}
                            departmentId={DepartmentId}
                          />,
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              </TabPane>
              <TabPane tab="Clinic" key="3" style={{ overflow: 'scroll' }}>
                <Row>
                  <Col span={12}>
                    <FormItem label="Plan Date">
                      {getFieldDecorator('planDate2', {
                        initialValue: planDate2,
                      })(
                        <RangePicker style={{ width: '100%' }} />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col span={6}>
                    <FormItem label="Start Date">
                      {getFieldDecorator('realStartDate2', {
                        initialValue: realStartDate2 ? moment(realStartDate2) : undefined,
                      })(
                        <DatePicker style={{ width: '100%' }} />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="End Date">
                      {getFieldDecorator('realEndDate2', {
                        initialValue: realEndDate2 ? moment(realEndDate2) : undefined,
                      })(
                        <DatePicker style={{ width: '100%' }} />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="Clinic">
                      {getFieldDecorator('clinic', {
                        initialValue: clinic,
                      })(
                        <HospitalSelect
                          studentId={StudentId}
                          departmentId={DepartmentId}
                          hospitalType={2}
                        />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="DPK">
                      {getFieldDecorator('dpk', {
                        initialValue: dpk,
                      })(
                        <DocentSelect
                          hospitalId={form.getFieldValue('clinic') ? form.getFieldValue('clinic').id : undefined}
                          departmentId={DepartmentId}
                        />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="Hospital 2" key="4">
                <Row>
                  <Col span={12}>
                    <FormItem label="Plan Date">
                      {getFieldDecorator('planDate3', {
                        initialValue: planDate3,
                      })(
                        <RangePicker style={{ width: '100%' }} />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row gutter={10}>
                  <Col span={6}>
                    <FormItem label="Start Date">
                      {getFieldDecorator('realStartDate3', {
                        initialValue: realStartDate3 ? moment(realStartDate3) : undefined,
                      })(
                        <DatePicker style={{ width: '100%' }} />,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem label="End Date">
                      {getFieldDecorator('realEndDate3', {
                        initialValue: realEndDate3 ? moment(realEndDate3) : undefined,
                      })(
                        <DatePicker style={{ width: '100%' }} />,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(ScheduleForm);
