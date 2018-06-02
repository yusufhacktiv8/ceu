import React, { Component } from 'react';
import axios from 'axios';
import { Form, Checkbox, Upload, Button, Icon, Row, Col, Spin, Tabs, notification, message } from 'antd';
import showError from '../utils/ShowError';
import SppList from './course/SppList';
import KrsList from './course/KrsList';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;

const FormItem = Form.Item;
const { TabPane } = Tabs;

class RegistrationForm extends Component {
  state = {
    saving: false,
  }
  componentWillMount() {
    this.setUploadProps(this.props.student);
  }

  onSubmit = () => {
    const { form, student } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          saving: true,
        });
        const axiosObj = axios.put(`${STUDENTS_URL}/${student.id}`, values);
        axiosObj.then(() => {
          message.success('Saving Ijazah success');
          this.setState({
            saving: false,
          });
        })
          .catch((error) => {
            this.setState({
              saving: false,
            });
            showError(error);
          });
      }
    });
  }

  setUploadProps = (student) => {
    const uploadProps = {
      name: 'ijazahFile',
      action: '',
      headers: {
        authorization: 'authorization-text',
      },
    };
    uploadProps.action = `${STUDENTS_URL}/${student.id}/uploadfile/ijazah`;
    uploadProps.onChange = (info) => {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification.success({
          message: 'Upload Ijazah success',
          description: info.file.response,
        });
      } else if (info.file.status === 'error') {
        notification.error({
          message: 'Upload Ijazah error',
          description: `${info.file.name} file upload failed.`,
        });
      }
    };
    this.setState({
      uploadProps,
    });
  }

  render() {
    const { saving } = this.state;
    const { student, form, loading } = this.props;
    const { getFieldDecorator } = form;

    const studentId = student.id;
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    let ijazahFileIdComponent = 'No File';
    if (student.ijazahFileId) {
      ijazahFileIdComponent = (
        <a target="_blank" href={`${STUDENTS_URL}/ijazah/${student.ijazahFileId}.jpg`}>
          {student.ijazahFileId}
        </a>
      );
    }

    return (
      <Form>
        <Tabs defaultActiveKey="1" style={{ minHeight: 445 }}>
          <TabPane tab="SPP" key="1">
            <SppList studentId={studentId} level={1} />
          </TabPane>
          <TabPane tab="KRS" key="2">
            <KrsList studentId={studentId} level={1} />
          </TabPane>
          <TabPane tab="Ijazah" key="3">
            <Spin indicator={antIcon} spinning={loading}>
              <Row>
                <Col span={8}>
                  <FormItem>
                    {getFieldDecorator('ijazah', {
                      valuePropName: 'checked',
                      initialValue: student.ijazah,
                    })(
                      <Checkbox>Ijazah</Checkbox>,
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem>
                    {ijazahFileIdComponent}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem
                    colon={false}
                  >
                    <Upload {...this.state.uploadProps} disabled={!student.id} showUploadList={false}>
                      <Button disabled={!student.id}>
                        <Icon type="upload" /> Click to Upload
                      </Button>
                    </Upload>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Button type="primary" loading={saving} onClick={this.onSubmit}>Save</Button>
                </Col>
              </Row>
            </Spin>
          </TabPane>
        </Tabs>
      </Form>
    );
  }
}

export default Form.create()(RegistrationForm);
