import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Icon, Affix, Row, Col } from 'antd';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import DashboardPage from '../dashboard/DashboardPage';
import ScoreUploadPage from '../uploads/scores/ScoreUploadPage';
import KompreScoreUploadPage from '../uploads/kompre/ScoreUploadPage';

const { Header, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

const parseJwt = (token) => {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};

const userMenu = (
  <Menu style={{ width: 150 }}>
    <Menu.Item>
      <Link
        to="/"
        onClick={() => {
          window.sessionStorage.removeItem('token');
        }}
      ><Icon type="logout" /> Logout</Link>
    </Menu.Item>
  </Menu>
);

class WorkspaceAssesment1 extends Component {
  state = {
    name: 'Anonymous',
    role: '',
  }

  componentWillMount() {
    const token = window.sessionStorage.getItem('token');
    axios.defaults.headers.common = {
      Authorization: `Bearer ${token}`,
    };
    const { name, role } = parseJwt(token);
    this.setState({
      name,
      role,
    });
  }

  render() {
    const location = this.props.location.pathname;
    let selectedKeys = 'dashboard';
    if (location.includes('uploadscores')) {
      selectedKeys = ['uploadscores'];
    }
    return (
      <Layout style={{ height: '100%' }}>
        <Header style={{ backgroundColor: '#FFF', padding: 0, lineHeight: 1, height: 90 }}>
          <Row>
            <Col span={6}>
              <div style={{ width: '100%', height: 35, padding: 15, paddingTop: 17, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 'bold', color: 'gray', border: '1px dotted silver', borderRadius: 50, padding: 7 }}>
                  <Icon type="dot-chart" style={{ marginRight: 5, color: 'gray', fontSize: 17 }} />
                  <span style={{ color: 'gray' }}>Clinical Education Unit &trade;</span>
                </span>
              </div>
            </Col>
            <Col span={6} offset={10}>
              <div style={{ paddingTop: 18, paddingRight: 10, textAlign: 'right', width: 400 }}>
                <Dropdown overlay={userMenu} style={{ width: 300 }}>
                  <a className="ant-dropdown-link" href="#">
                    {this.state.name} ({this.state.role}) <Icon type="down" />
                  </a>
                </Dropdown>
              </div>
            </Col>
          </Row>
          <Affix>
            <div>
              <Menu
                onClick={this.handleClick}
                selectedKeys={selectedKeys}
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
                <SubMenu title={<span><Icon type="upload" />Uploads</span>}>
                  <Menu.Item key="uploadscores">
                    <Link to="/uploadscores">Scores</Link>
                  </Menu.Item>
                  <Menu.Item key="uploadukomprescores">
                    <Link to="/uploadukomprescores">Kompre Scores</Link>
                  </Menu.Item>
                </SubMenu>
              </Menu>
            </div>
          </Affix>
        </Header>
        <Content style={{ backgroundColor: '#FFF' }}>
          <div>
            <Route exact path="/" component={DashboardPage} />
            <Route exact path="/uploadscores" component={ScoreUploadPage} />
            <Route exact path="/uploadukomprescores" component={KompreScoreUploadPage} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default WorkspaceAssesment1;
