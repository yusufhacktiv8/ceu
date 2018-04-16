import React from 'react';

import CourseListItem from './CourseListItem';

export default ({ courses, showDetails }) => (
  <ul style={{ listStyle: 'none', padding: 0 }}>
    {
      courses
        .map(course =>
          (
            <CourseListItem course={course} key={course.id} showDetails={showDetails} />
          ),
        )
    }
  </ul>
);
