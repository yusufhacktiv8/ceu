import React, { Component } from 'react';
import axios from 'axios';
import { Form, Checkbox, Upload, Button, Icon, Row, Col, Spin, notification, message } from 'antd';
import showError from '../utils/ShowError';

const STUDENTS_URL = `${process.env.REACT_APP_SERVER_URL}/api/students`;

const FormItem = Form.Item;

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
          message.success('Saving krs success');
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
      name: 'krsFile',
      action: '',
      headers: {
        authorization: 'authorization-text',
      },
    };
    uploadProps.action = `${STUDENTS_URL}/${student.id}/uploadfile/krs`;
    uploadProps.onChange = (info) => {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification.success({
          message: 'Upload KRS success',
          description: info.file.response,
        });
      } else if (info.file.status === 'error') {
        notification.error({
          message: 'Upload KRS error',
          description: `${info.file.name} file upload failed.`,
        });
      }
    };
    this.setState({
      uploadProps,
    });
  }

  setUploadProps2 = (student) => {
    const uploadProps = {
      name: 'sppFile',
      action: '',
      headers: {
        authorization: 'authorization-text',
      },
    };
    uploadProps.action = `${STUDENTS_URL}/${student.id}/uploadfile/spp`;
    uploadProps.onChange = (info) => {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification.success({
          message: 'Upload SPP success',
          description: info.file.response,
        });
      } else if (info.file.status === 'error') {
        notification.error({
          message: 'Upload SPP error',
          description: `${info.file.name} file upload failed.`,
        });
      }
    };
    this.setState({
      uploadProps2: uploadProps,
    });
  }

  setUploadProps3 = (student) => {
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
      uploadProps3: uploadProps,
    });
  }

  render() {
    const { saving } = this.state;
    const { student, form, loading } = this.props;
    const { getFieldDecorator } = form;

    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;

    let krsFileIdComponent = 'No File';
    if (student.krsFileId) {
      krsFileIdComponent = (
        <a target="_blank" href={`${STUDENTS_URL}/krs/${student.krsFileId}.jpg`}>
          {student.krsFileId}
        </a>
      );
    }

    let sppFileIdComponent = 'No File';
    if (student.sppFileId) {
      sppFileIdComponent = (
        <a target="_blank" href={`${STUDENTS_URL}/spp/${student.sppFileId}.jpg`}>
          {student.sppFileId}
        </a>
      );
    }

    let ijazahFileIdComponent = 'No File';
    if (student.ijazahFileId) {
      ijazahFileIdComponent = (
        <a target="_blank" href={`${STUDENTS_URL}/ijazah/${student.ijazahFileId}.jpg`}>
          {student.ijazahFileId}
        </a>
      );
    }

    return (
      <Spin indicator={antIcon} spinning={loading}>
        <Form>
          <Row>
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('krs', {
                  valuePropName: 'checked',
                  initialValue: student.krs,
                })(
                  <Checkbox>KRS</Checkbox>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {krsFileIdComponent}
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
            <Col span={8}>
              <FormItem>
                {getFieldDecorator('spp', {
                  valuePropName: 'checked',
                  initialValue: student.spp,
                })(
                  <Checkbox>SPP</Checkbox>,
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem>
                {sppFileIdComponent}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                colon={false}
              >
                <Upload {...this.state.uploadProps2} disabled={!student.id} showUploadList={false}>
                  <Button disabled={!student.id}>
                    <Icon type="upload" /> Click to Upload
                  </Button>
                </Upload>
              </FormItem>
            </Col>
          </Row>
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
                <Upload {...this.state.uploadProps3} disabled={!student.id} showUploadList={false}>
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
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(RegistrationForm);
