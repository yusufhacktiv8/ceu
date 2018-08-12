import React, { Component } from 'react';
import axios from 'axios';
import { Form, Checkbox, Upload, Button, Icon, Row, Col, Spin, Tabs, Popconfirm, notification, message } from 'antd';
import showError from '../../utils/ShowError';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;
const FILES_URL = process.env.REACT_APP_FILES_URL;

const FormItem = Form.Item;
const { TabPane } = Tabs;

class GraduatePage extends Component {
  state = {
    saving: false,
  }
  componentWillMount() {
    this.setUploadProps(this.props.student);
  }

  onSubmit = () => {
    const { form, student, onStudentUpdate } = this.props;
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
          onStudentUpdate();
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
    const { onStudentUpdate } = this.props;
    const token = window.sessionStorage.getItem('token');
    const uploadProps = {
      name: 'ijazahAkhirFile',
      action: '',
      headers: {
        authorization: `Bearer ${token}`,
      },
    };
    uploadProps.action = `${STUDENTS_URL}/${student.id}/uploadfile/ijazahakhir`;
    uploadProps.onChange = (info) => {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification.success({
          message: 'Upload Ijazah success',
          description: info.file.response,
        });
        onStudentUpdate();
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

  deleteIjazahFile(student) {
    const { onStudentUpdate } = this.props;
    const hide = message.loading('Action in progress..', 0);
    axios.put(`${STUDENTS_URL}/${student.id}/uploadfile/ijazahakhir`)
      .then(() => {
        message.success('Delete file success');
        onStudentUpdate();
      })
      .catch((error) => {
        showError(error);
      })
      .finally(() => {
        hide();
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
        <div>
          <span style={{ marginRight: 5 }}>
            <Popconfirm
              title={'Are you sure to remove file'}
              onConfirm={() => this.deleteIjazahFile(student)}
              okText="Yes" cancelText="No"
            >
              <Button
                style={{ border: 0 }}
                icon="close-circle"
                shape="circle"
                size="small"
              />
            </Popconfirm>
          </span>
          <span>
            <a target="_blank" href={`${FILES_URL}/students/${student.id}/ijazah/${student.ijazahFileId}.jpg`}>
              {student.ijazahFileId}
            </a>
          </span>
        </div>
      );
    }

    return (
      <Form>
        <Tabs defaultActiveKey="1" style={{ minHeight: 300 }}>
          <TabPane tab="Ijazah" key="1">
            <Spin indicator={antIcon} spinning={loading}>
              <Row>
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
            </Spin>
          </TabPane>
        </Tabs>
      </Form>
    );
  }
}

export default Form.create()(GraduatePage);
