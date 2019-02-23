import React, { Component } from 'react';
import { Layout, Menu, Dropdown, Icon, Affix, Row, Col } from 'antd';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import RolePage from '../role/RolePage';
import UserPage from '../user/UserPage';
import HospitalUserPage from '../settings/hospital_user/UserPage';
import StudentPage from '../student/StudentPage';
import StudentDetailsPage from '../student/StudentDetailsPage';
import DepartmentPage from '../settings/department/DepartmentPage';
import CourseDetailsPage from '../student/course/details/CourseDetailsPage';
import HospitalPage from '../hospital/HospitalPage';
import HospitalDepartmentPage from '../hospital/HospitalDepartmentPage';
import CostUnitPage from '../report/finance/CostUnitPage';
import CostUnitClinicPage from '../report/finance/CostUnitClinicPage';
import InitiatePage from '../process/initiate/InitiatePage';
import CompletedPage from '../process/completed/CompletedPage';
import LevelPage from '../process/level/LevelPage';
import AssistancePage from '../process/assistance/AssistancePage';
import PreTestPage from '../report/schedule/PreTestPage';
import DashboardPage from '../dashboard/DashboardPage';
import YudisiumCandidatePage from '../report/schedule/YudisiumSchedulePage';
import MidKompreSchedulePage from '../report/schedule/MidKompreSchedulePage';
import ScoreUploadPage from '../uploads/scores/ScoreUploadPage';
import KompreScoreUploadPage from '../uploads/kompre/ScoreUploadPage';
import RotationPage from '../report/rotation/RotationPage';
import StudentUserPage from '../settings/student_user/UserPage';

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
    console.log(this.props.location.pathname);
    const location = this.props.location.pathname;
    let selectedKeys = 'dashboard';
    if (location.includes('roles')) {
      selectedKeys = ['roles'];
    } else if (location.includes('users')) {
      selectedKeys = ['users'];
    } else if (location.includes('students') || location.includes('studentdetails')) {
      selectedKeys = ['students'];
    } else if (location.includes('departments') && !location.includes('hospitals')) {
      selectedKeys = ['departments'];
    } else if (location.includes('hospitals')) {
      selectedKeys = ['hospitals'];
    } else if (location.includes('costunit') && !location.includes('costunitclinic')) {
      selectedKeys = ['costunit'];
    } else if (location.includes('costunitclinic')) {
      selectedKeys = ['costunitclinic'];
    } else if (location.includes('initiate')) {
      selectedKeys = ['initiate'];
    } else if (location.includes('completed')) {
      selectedKeys = ['completed'];
    } else if (location.includes('level')) {
      selectedKeys = ['level'];
    } else if (location.includes('assistance')) {
      selectedKeys = ['assistance'];
    } else if (location.includes('pretest')) {
      selectedKeys = ['pretest'];
    } else if (location.includes('bakordik')) {
      selectedKeys = ['bakordik'];
    } else if (location.includes('yudisiumschedule')) {
      selectedKeys = ['yudisiumschedule'];
    } else if (location.includes('midkomreschedule')) {
      selectedKeys = ['midkomreschedule'];
    } else if (location.includes('uploadscores')) {
      selectedKeys = ['uploadscores'];
    } else if (location.includes('uploadukomprescores')) {
      selectedKeys = ['uploadukomprescores'];
    } else if (location.includes('rotations')) {
      selectedKeys = ['rotations'];
    } else if (location.includes('studentusers')) {
      selectedKeys = ['studentusers'];
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
                    {this.state.name} ({this.state.role})<Icon type="down" />
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
                <Menu.Item key="students">
                  <Link to="/students"><Icon type="team" />Students</Link>
                </Menu.Item>
                <Menu.Item key="hospitals">
                  <Link to="/hospitals"><Icon type="medicine-box" />Hospitals</Link>
                </Menu.Item>
                <SubMenu title={<span><Icon type="solution" />Process</span>}>
                  <Menu.Item key="initiate">
                    <Link to="/initiate">Initiate</Link>
                  </Menu.Item>
                  <Menu.Item key="completed">
                    <Link to="/completed">Completed</Link></Menu.Item>
                  <Menu.Item key="level">
                    <Link to="/level">Mid Kompre Candidate</Link></Menu.Item>
                  <Menu.Item key="assistance">
                    <Link to="/assistance">Assistance</Link></Menu.Item>
                </SubMenu>
                <SubMenu title={<span><Icon type="file-text" />Reports</span>}>
                  <MenuItemGroup title="Finance">
                    <Menu.Item key="costunit">
                      <Link to="/costunit">Cost Unit</Link>
                    </Menu.Item>
                    <Menu.Item key="costunitclinic">
                      <Link to="/costunitclinic">Cost Unit Clinic</Link></Menu.Item>
                  </MenuItemGroup>
                  <MenuItemGroup title="Schedule">
                    <Menu.Item key="pretest">
                      <Link to="/pretest">Pre Test</Link>
                    </Menu.Item>
                    <Menu.Item key="midkomrepschedule">
                      <Link to="/midkomrepschedule">Mid Kompre</Link>
                    </Menu.Item>
                    <Menu.Item key="yudisiumschedule">
                      <Link to="/yudisiumschedule">Yudisium</Link>
                    </Menu.Item>
                  </MenuItemGroup>
                  <MenuItemGroup title="Resumes">
                    <Menu.Item key="rotations">
                      <Link to="/rotations">Rotations</Link>
                    </Menu.Item>
                  </MenuItemGroup>
                </SubMenu>
                <SubMenu title={<span><Icon type="upload" />Uploads</span>}>
                  <Menu.Item key="uploadscores">
                    <Link to="/uploadscores">Scores</Link>
                  </Menu.Item>
                  <Menu.Item key="uploadukomprescores">
                    <Link to="/uploadukomprescores">Kompre Scores</Link>
                  </Menu.Item>
                </SubMenu>
                <SubMenu title={<span><Icon type="setting" />Settings</span>}>
                  <MenuItemGroup title="Security">
                    <Menu.Item key="users">
                      <Link to="/users">Users</Link>
                    </Menu.Item>
                    <Menu.Item key="bakordik">
                      <Link to="/bakordik">Hospital Users</Link>
                    </Menu.Item>
                    <Menu.Item key="studentusers">
                      <Link to="/studentusers">Student Users</Link>
                    </Menu.Item>
                    <Menu.Item key="roles">
                      <Link to="/roles">Roles</Link></Menu.Item>
                  </MenuItemGroup>
                  <MenuItemGroup title="Application">
                    <Menu.Item key="departments">
                      <Link to="/departments">Departments</Link>
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
            <Route path="/roles" component={RolePage} />
            <Route path="/users" component={UserPage} />
            <Route path="/bakordik" component={HospitalUserPage} />
            <Route exact path="/students" component={StudentPage} />
            <Route exact path="/students/:studentId" component={StudentDetailsPage} />
            <Route path="/departments" component={DepartmentPage} />
            <Route path="/students/:studentId/courses/:courseId" component={CourseDetailsPage} />
            <Route exact path="/hospitals" component={HospitalPage} />
            <Route exact path="/hospitals/:hospitalId/departments" component={HospitalDepartmentPage} />
            <Route exact path="/costunit" component={CostUnitPage} />
            <Route exact path="/costunitclinic" component={CostUnitClinicPage} />
            <Route exact path="/initiate" component={InitiatePage} />
            <Route exact path="/completed" component={CompletedPage} />
            <Route exact path="/level" component={LevelPage} />
            <Route exact path="/assistance" component={AssistancePage} />
            <Route exact path="/pretest" component={PreTestPage} />
            <Route exact path="/yudisiumschedule" component={YudisiumCandidatePage} />
            <Route exact path="/midkomrepschedule" component={MidKompreSchedulePage} />
            <Route exact path="/uploadscores" component={ScoreUploadPage} />
            <Route exact path="/uploadukomprescores" component={KompreScoreUploadPage} />
            <Route exact path="/rotations" component={RotationPage} />
            <Route path="/studentusers" component={StudentUserPage} />
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Workspace;
