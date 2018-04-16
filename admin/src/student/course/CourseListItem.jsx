import React from 'react';
import Tag from 'antd/lib/tag';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Badge from 'antd/lib/badge';
import './CourseListItem.css';

const CourseListItem = ({ course, showDetails }) => {
  let status = '';
  let text = '';

  switch (course.status) {
    case 0:
      status = 'default';
      text = 'Scheduled';
      break;
    case 1:
      status = 'processing';
      text = 'On Going';
      break;
    case 2:
      status = 'success';
      text = 'Completed';
      break;
    case 3:
      status = 'error';
      text = 'Problem';
      break;
    case 4:
      status = 'error';
      text = 'Pending';
      break;
    default:
      break;
  }
  return (
    <li className="CourseListItem" key={course.id}>
      <Row>
        <Col span={4}>
          <Tag className="CourseListItem-tag" color={course.Department.color} onClick={() => showDetails(course)}>
            {course.Department.code}
          </Tag>
        </Col>
        <Col span={13}>
          <div className="CourseListItem-title">{course.title}</div>
        </Col>
        <Col span={7}>
          <Badge className="CourseListItem-status" status={status} text={text} />
        </Col>
      </Row>
    </li>
  );
};

export default CourseListItem;
