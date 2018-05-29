import React, { Component } from 'react';
import { Modal, Form, Input, Button, Tabs, message } from 'antd';
// import axios from 'axios';
// import showError from '../../utils/ShowError';
import SppList from './SppList';

// const ROLES_URL = `${process.env.REACT_APP_SERVER_URL}/api/roles`;

const FormItem = Form.Item;
const { TabPane } = Tabs;

class PreRequisiteWindow extends Component {
  state = {
    saving: false,
  }

  render() {
    const { saving } = this.state;
    const { visible, onCancel, form, studentId, level } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        wrapClassName="vertical-center-modal"
        width={650}
        visible={visible}
        title="Pre-Requisite"
        okText="Save"
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>Close</Button>,
        ]}
      >
        <Tabs defaultActiveKey="1" style={{ minHeight: 445 }}>
          <TabPane tab="SPP" key="1">
            <SppList studentId={studentId} level={level} />
          </TabPane>
          <TabPane tab="KRS" key="2">
          </TabPane>
        </Tabs>
      </Modal>
    );
  }
}

export default Form.create()(PreRequisiteWindow);
