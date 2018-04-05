import React, { Component } from 'react';
import { Layout, Menu, Icon, Affix } from 'antd';
import { Route, Link } from 'react-router-dom';
import StudentList from '../student/StudentList';

const { Header, Content } = Layout;
const SubMenu = Menu.SubMenu;

class Workspace extends Component {
  state = {
    selectedKeys: ['dashboard'],
  }

  render() {
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ backgroundColor: '#FFF', padding: 0, lineHeight: 1, height: 90 }}>
          <div style={{ width: '100%', height: 35, padding: 15, paddingTop: 17, marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 'bold', color: 'gray', border: '1px dotted silver', borderRadius: 50, padding: 7 }}>
              <Icon type="dot-chart" style={{ marginRight: 5, color: 'gray', fontSize: 17 }} />
              <span style={{ color: 'gray' }}>Clinical Education Unit &trade;</span>
            </span>
          </div>
          <Affix>
            <div>
              <Menu
                onClick={this.handleClick}
                selectedKeys={this.state.selectedKeys}
                mode="horizontal"
              >
                <Menu.Item key="dashboard">
                  <Link
                    to="/"
                    onClick={() => {
                      this.setState({
                        selectedKeys: ['dashboard'],
                      });
                    }}
                  ><Icon type="pie-chart" />Dashboard</Link>
                </Menu.Item>
                <Menu.Item key="students">
                  <Link
                    to="/students"
                    onClick={() => {
                      this.setState({
                        selectedKeys: ['students'],
                      });
                    }}
                  ><Icon type="contacts" />Students</Link>
                </Menu.Item>
              </Menu>
            </div>
          </Affix>
        </Header>
        <Content style={{ backgroundColor: '#FFF' }}>
          <div style={{ padding: 10 }}>
            <Route path="/students" component={StudentList} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Workspace;
