import React, { Component } from 'react';
import { Form, Checkbox, Upload, Button, Icon, Row, Col, notification } from 'antd';

const API_URL = `${process.env.REACT_APP_SERVER_URL}/api`;

const FormItem = Form.Item;

class RegistrationForm extends Component {
  componentWillMount() {
    this.setUploadProps(this.props.student);
  }

  setUploadProps = (student) => {
    const uploadProps = {
      name: 'krsFile',
      action: '',
      headers: {
        authorization: 'authorization-text',
      },
    };
    uploadProps.action = `${API_URL}/students/${student.id}/uploadfile/krs`;
    uploadProps.onChange = (info) => {
      if (info.file.status !== 'uploading') {
        // console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        notification.success({
          message: 'Upload file success',
          description: info.file.response,
        });
      } else if (info.file.status === 'error') {
        notification.error({
          message: 'Upload file error',
          description: `${info.file.name} file upload failed.`,
        });
      }
    };
    this.setState({
      uploadProps,
    });
  }

  onSubmit = () => {
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values);
    });
  }
  render() {
    const { student, form } = this.props;
    const { getFieldDecorator } = form;

    let krsFileIdComponent = 'No File';

    if (student.krsFileId) {
      krsFileIdComponent = (
        <a target="_blank" href={`${API_URL}/student/krs/${student.krsFileId}.jpg`}>
          {student.krsFileId}
        </a>
      );
    }

    return (
      <Form>
        <Row>
          <Col span={8}>
            <FormItem>
              {getFieldDecorator('krs', {
                valuePropName: 'checked',
                initialValue: student.krs,
              })(
                <Checkbox>KRS</Checkbox>
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
          <Col span={24}>
            <FormItem>
              {getFieldDecorator('spp', {
                valuePropName: 'checked',
                initialValue: student.spp,
              })(
                <Checkbox>SPP</Checkbox>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Button type="primary" onCLick={this.onSubmit}>Save</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(RegistrationForm);
