import React, { Component } from 'react';
import { Form, Input, Row, Col, Tag, Badge } from 'antd';
import axios from 'axios';
import numeral from 'numeral';
import showError from '../../../utils/ShowError';

const FormItem = Form.Item;

const COURSES_URL = `${process.env.REACT_APP_SERVER_URL}/api/courses`;
const getScoresUrl = courseId => `${COURSES_URL}/${courseId}/scores`;

class InfoForm extends Component {
  state = {
    course: {},
    scores: [],
  }

  componentDidMount() {
    this.fetchCourse();
    this.fetchScores();
  }

  fetchScores = () => {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(getScoresUrl(courseId), {})
      .then((response) => {
        this.setState({
          scores: response.data,
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

  fetchCourse = () => {
    const { courseId } = this.props;
    this.setState({
      loading: true,
    });
    axios.get(`${COURSES_URL}/${courseId}`, {})
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
    const { form } = this.props;
    const { course, scores } = this.state;
    const { getFieldDecorator } = form;
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
        text = `Problem : ${'courseForm.tempProblemDescription.value'}`;
        break;
      case 4:
        status = 'error';
        text = 'Pending';
        break;
      default:
        break;
    }

    const score1Arr = scores.filter(score => score.ScoreType.code === 'PRETEST');
    const score1 = score1Arr.length > 0 ? score1Arr[0].scoreValue : null;
    const score1Percentage = score1 ? score1 * 0 : null;

    const score2Arr = scores.filter(score => score.ScoreType.code === 'CASEREPORT');
    const score2 = score2Arr.length > 0 ? score2Arr[0].scoreValue : null;
    const score2Percentage = score2 ? score2 * 0.1 : null;

    const score3Arr = scores.filter(score => score.ScoreType.code === 'WEEKLYDISCUSSION');
    const score3 = score3Arr.length > 0 ? score3Arr[0].scoreValue : null;
    const score3Percentage = score3 ? score3 * 0.2 : null;

    const score4Arr = scores.filter(score => score.ScoreType.code === 'CASETEST');
    const score4 = score4Arr.length > 0 ? score4Arr[0].scoreValue : null;
    const score4Percentage = score4 ? score4 * 0.35 : null;

    const score5Arr = scores.filter(score => score.ScoreType.code === 'POSTTEST');
    const score5 = score5Arr.length > 0 ? score5Arr[0].scoreValue : null;
    const score5Percentage = score5 ? score5 * 0.35 : null;

    const totalPercentage = score1Percentage + score2Percentage + score3Percentage
    + score4Percentage + score5Percentage;

    const total = score1 + score2 + score3
    + score4 + score5;

    let totalInCriteria = null;
    const totalPercentageRound = totalPercentage; // mathjs.round(totalPercentage, 2);
    if (totalPercentageRound >= 80 && totalPercentageRound <= 100) {
      totalInCriteria = <span style={{ color: '#5093E1' }}>A</span>;
    } else if (totalPercentageRound >= 70 && totalPercentageRound <= 79) {
      totalInCriteria = <span style={{ color: '#50C14E' }}>B</span>;
    } else if (totalPercentageRound >= 60 && totalPercentageRound <= 69) {
      totalInCriteria = <span style={{ color: 'orange' }}>C</span>;
    } else if (totalPercentageRound > 0 && totalPercentageRound <= 59) {
      totalInCriteria = <span style={{ color: 'red' }}>E</span>;
    } else if (totalPercentageRound <= 0) {
      totalInCriteria = <span style={{ color: 'gray' }}>-</span>;
    }

    return (
      <Form layout="vertical">
        <Row>
          <Col span={12}>
            <FormItem label="Title">
              {getFieldDecorator('title', {
                initialValue: course.title,
                rules: [
                  { required: true, message: 'Please input title' },
                ],
              })(
                <Input maxLength="50" />,
              )}
            </FormItem>
          </Col>
        </Row>
        <table>
          <tbody>
            <tr>
              <td style={{ width: 160, height: 35 }}>1. Pre Test (SCB)</td>
              <td
                style={{ width: 40, textAlign: 'right' }}
              >
                {score1 ? numeral(score1).format('0,0.00') : '-'}
              </td>
              <td style={{ textAlign: 'right', paddingLeft: 20, height: 35 }}>
                <Tag>{`${numeral(score1Percentage).format('0,0.00')} %`}</Tag>
              </td>
            </tr>
            <tr>
              <td style={{ width: 160, height: 35 }}>2. Case Report</td>
              <td
                style={{ width: 40, textAlign: 'right' }}
              >
                {score2 ? numeral(score2).format('0,0.00') : '-'}
              </td>
              <td style={{ textAlign: 'right', paddingLeft: 20, height: 35 }}>
                <Tag>{`${numeral(score2Percentage).format('0,0.00')} %`}</Tag>
              </td>
            </tr>
            <tr>
              <td style={{ width: 160, height: 35 }}>3. Weekly Discussion</td>
              <td
                style={{ width: 40, textAlign: 'right' }}
              >
                {score3 ? numeral(score3).format('0,0.00') : '-'}
              </td>
              <td style={{ textAlign: 'right', paddingLeft: 20 }}>
                <Tag>{`${numeral(score3Percentage).format('0,0.00')} %`}</Tag>
              </td>
            </tr>
            <tr>
              <td style={{ width: 160, height: 35 }}>4. Case Test</td>
              <td
                style={{ width: 40, textAlign: 'right' }}
              >
                {score4 ? numeral(score4).format('0,0.00') : '-'}
              </td>
              <td style={{ textAlign: 'right', paddingLeft: 20 }}>
                <Tag>{`${numeral(score4Percentage).format('0,0.00')} %`}</Tag>
              </td>
            </tr>
            <tr>
              <td style={{ width: 160, height: 35 }}>5. Post Test</td>
              <td
                style={{ width: 40, textAlign: 'right' }}
              >
                {score5 ? numeral(score5).format('0,0.00') : '-'}
              </td>
              <td style={{ textAlign: 'right', paddingLeft: 20 }}>
                <Tag>{`${numeral(score5Percentage).format('0,0.00')} %`}</Tag>
              </td>
            </tr>
            <tr>
              <td><span style={{ width: 160, fontWeight: 'bold', fontSize: 15, height: 35 }}>Total</span></td>
              <td style={{ width: 40, textAlign: 'right' }}>
                {numeral(total).format('0,0.00')}
              </td>
              <td style={{ textAlign: 'right', paddingLeft: 20 }}>
                <Tag>{`${numeral(totalPercentage).format('0,0.00')} %`}</Tag>
              </td>
            </tr>
            <tr>
              <td><span style={{ fontWeight: 'bold', fontSize: 15 }}>Score</span></td>
              <td />
              <td style={{ textAlign: 'center' }}><span style={{ fontWeight: 'bold', fontSize: 20 }}>{totalInCriteria}</span></td>
            </tr>
          </tbody>
        </table>
        <span style={{ fontWeight: 'bold', fontSize: 15, marginRight: 10 }}>Status: </span><Badge status={status} text={text} />
      </Form>
    );
  }
}

export default Form.create()(InfoForm);
