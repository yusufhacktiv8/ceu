import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Icon, Affix, Row, Col } from 'antd';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import SeminarPage from '../seminar/SeminarPage';
import StudentDetailsPage from '../student/StudentDetailsPage';
import CourseDetailsPage from '../bakordik/CourseDetailsPage';
import DashboardPage from '../dashboard/DashboardPage';
import SeminarTypePage from '../settings/seminar_type/SeminarTypePage';
import SupervisorPage from '../settings/supervisor/SupervisorPage';

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

class Workspace extends Component {
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
    if (location.includes('seminars') && !location.includes('seminartypes')) {
      selectedKeys = ['seminars'];
    } else if (location.includes('seminartypes')) {
      selectedKeys = ['seminarTypes'];
    } else if (location.includes('supervisors')) {
      selectedKeys = ['supervisors'];
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
            <Col span={6} offset={12}>
              <div style={{ paddingTop: 18, paddingRight: 25, textAlign: 'right' }}>
                <Dropdown overlay={userMenu} style={{ width: 200 }}>
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
                <Menu.Item key="seminars">
                  <Link to="/seminars"><Icon type="file" />Seminars</Link>
                </Menu.Item>
                <SubMenu title={<span><Icon type="setting" />Settings</span>}>
                  <MenuItemGroup title="Application">
                    <Menu.Item key="seminarTypes">
                      <Link to="/seminartypes">Seminar Types</Link>
                    </Menu.Item>
                    <Menu.Item key="supervisors">
                      <Link to="/supervisors">Supervisors</Link>
                    </Menu.Item>
                  </MenuItemGroup>
                </SubMenu>
              </Menu>
            </div>
          </Affix>
        </Header>
        <Content style={{ backgroundColor: '#FFF' }}>
          <div>
            <Route exact path="/" component={DashboardPage} />
            <Route exact path="/seminars" component={SeminarPage} />
            <Route exact path="/students/:studentId" component={StudentDetailsPage} />
            <Route path="/students/:studentId/courses/:courseId" component={CourseDetailsPage} />
            <Route exact path="/seminartypes" component={SeminarTypePage} />
            <Route exact path="/supervisors" component={SupervisorPage} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Workspace;
