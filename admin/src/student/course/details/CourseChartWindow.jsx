import React, { Component } from 'react';
import { Modal, Button, Switch } from 'antd';
import moment from 'moment';
import Gantt from '../../../chart/Gantt';

const parseChartData = (courses) => {
  const result = [];
  let childId = 100000000;
  for (let i = 0; i < courses.length; i += 1) {
    const course = courses[i];
    const mainSchedule = {
      id: course.id,
      text: course.title,
      color: course.Department.color,
      start_date: moment(course.planStartDate).format('DD-MM-YYYY'),
      end_date: moment(course.planEndDate).format('DD-MM-YYYY'),
    };

    const hospitalSchedule1 = {
      id: course.id + childId,
      parent: course.id,
      text: 'RS 1',
      color: '#D6DBDF',
      start_date: moment(course.planStartDate1).format('DD-MM-YYYY'),
      end_date: moment(course.planEndDate1).format('DD-MM-YYYY'),
    };

    childId += 1;

    result.push(mainSchedule);
    result.push(hospitalSchedule1);

    if (course.planStartDate2 && course.planStartDate3) {
      const clinic = {
        id: course.id + childId,
        parent: course.id,
        text: 'Puskesmas',
        color: '#D6DBDF',
        start_date: moment(course.planStartDate2).format('DD-MM-YYYY'),
        end_date: moment(course.planEndDate2).format('DD-MM-YYYY'),
      };

      childId += 1;

      const hospitalSchedule2 = {
        id: course.id + childId,
        parent: course.id,
        text: 'RS 2',
        color: '#D6DBDF',
        start_date: moment(course.planStartDate3).format('DD-MM-YYYY'),
        end_date: moment(course.planEndDate3).format('DD-MM-YYYY'),
      };

      result.push(clinic);
      result.push(hospitalSchedule2);
    }

    if (course.realStartDate && course.realEndDate) {
      childId += 1;

      const realMainSchedule = {
        id: course.id + childId,
        text: `${course.title} - Real`,
        color: course.Department.color,
        start_date: moment(course.realStartDate).format('DD-MM-YYYY'),
        end_date: moment(course.realEndDate).format('DD-MM-YYYY'),
      };

      result.push(realMainSchedule);

      if (course.realStartDate1 && course.realEndDate1) {
        childId += 1;
        const realHospitalSchedule1 = {
          id: course.id + childId,
          parent: realMainSchedule.id,
          text: 'RS 1 - Real',
          color: '#D6DBDF',
          start_date: moment(course.realStartDate1).format('DD-MM-YYYY'),
          end_date: moment(course.realEndDate1).format('DD-MM-YYYY'),
        };

        result.push(realHospitalSchedule1);
      }

      if (course.realStartDate2 && course.realEndDate2) {
        childId += 1;
        const realClinic = {
          id: course.id + childId,
          parent: realMainSchedule.id,
          text: 'Puskesmas - Real',
          color: '#D6DBDF',
          start_date: moment(course.realStartDate2).format('DD-MM-YYYY'),
          end_date: moment(course.realEndDate2).format('DD-MM-YYYY'),
        };

        result.push(realClinic);
      }

      if (course.realStartDate3 && course.realEndDate3) {
        childId += 1;
        const realHospitalSchedule2 = {
          id: course.id + childId,
          parent: realMainSchedule.id,
          text: 'RS 2 - Real',
          color: '#D6DBDF',
          start_date: moment(course.realStartDate3).format('DD-MM-YYYY'),
          end_date: moment(course.realEndDate3).format('DD-MM-YYYY'),
        };

        result.push(realHospitalSchedule2);
      }
    }

    childId += 300;
  }

  console.log('>>>>>>>', result);

  return result;
};

export default class CourseChartWindow extends Component {
  state = {
    weekly: true,
  }

  changeWeekly = (checked) => {
    this.setState({
      weekly: checked,
    });
  }

  render() {
    const { visible, onCancel, courses, level } = this.props;
    const { weekly } = this.state;
    const courseCharData = {
      data: parseChartData(courses.filter(course =>
        course.Department.level === parseInt(level, 10))),
    };

    return (
      <Modal
        title="Courses Chart"
        visible={visible}
        onCancel={onCancel}
        wrapClassName="vertical-center-modal"
        footer={[
          <span style={{ marginRight: 10 }}>Weekly</span>,
          <Switch
            checked={weekly}
            style={{ marginRight: 10 }}
            onChange={this.changeWeekly}
          />,
          <Button size="large" onClick={onCancel}>Close</Button>,
        ]}
        width="95%"
      >
        <div style={{ height: 500 }}>
          <Gantt tasks={courseCharData} weekly={weekly} />
        </div>
      </Modal>
    );
  }
}
