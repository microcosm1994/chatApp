import React, { Component } from 'react'
import {Layout, Menu, Icon, Avatar, Dropdown } from 'antd'
import { Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import cookie from 'react-cookies'
import io from 'socket.io-client'
import {$axios} from "../lib/interceptors";
// connect方法的作用：将额外的props传递给组件，并返回新的组件，组件在该过程中不会受到影响
import { connect } from 'react-redux'
// 引入action
import { setPageTitle, setInfoList } from '../store/action'
import Friends from './friends'
import '../css/home.css'

const { Header, Sider, Content } = Layout
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
class Home extends Component{
    constructor (props) {
        super(props)
        console.log(props);
        this.state = {
            route: props.route.routes,
            user: {
                nickname: cookie.load('nickname'),
                uid: cookie.load('uid'),
                token: cookie.load('t')
            }
        }
    }
    componentDidMount () {
        // 创建socket连接
        const socket = io('ws://localhost:7001', {
            reconnectionAttempts: 10,
            query: {
                uid: this.state.user.uid
            }
        })
    }
    handleClick = e => {
        let path = e.item.props.path
        this.props.history.push(path)
    }
    headerClick = e => {
        let pathArr = ['/login']
        let index = e.key - 0
        switch (index) {
            case 0:
                $axios.post('/api/user/logout').then((res) => {
                    if (res.status === 200) {
                        cookie.remove('nickname')
                        this.props.history.push(pathArr[index])
                    }
                })
                break
            default:
                break
        }
    }
    render () {
        // 下拉菜单
        const hearderMenu = (
            <Menu onClick={this.headerClick}>
                <Menu.Item key="0">
                    退 出
                </Menu.Item>
            </Menu>
        );
        return(
            <Layout className='home'>
                {/*头部*/}
                <Header className='home-header'>
                    <div className='home-header-user'>
                        <div className='home-header-user-avator'>
                            <Avatar shape='square' size={30}  src='../img/avator.jpg' />
                        </div>
                        <div className='home-header-user-menu'>
                            <Dropdown overlay={hearderMenu} trigger={['click']}>
                                <a className="ant-dropdown-link" href="#javascript:;">
                                    {this.state.user.nickname}<Icon type="down" />
                                </a>
                            </Dropdown>,
                        </div>
                    </div>
                </Header>
                <Layout className='home-body'>
                    {/*侧边栏*/}
                    <Sider className='home-body-sidebar'>
                        <Menu
                            onClick={this.handleClick}
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            mode="inline"
                        >
                            <SubMenu
                                key="sub1"
                                title={
                                    <span>
              <Icon type="mail" />
              <span>Navigation One</span>
            </span>
                                }
                            >
                                <MenuItemGroup key="g1" title="Item 1">
                                    <Menu.Item key="1" path='/message'>Option 1</Menu.Item>
                                    <Menu.Item key="2" path='/chatWindow'>Option 2</Menu.Item>
                                </MenuItemGroup>
                                <MenuItemGroup key="g2" title="Item 2">
                                    <Menu.Item key="3">Option 3</Menu.Item>
                                    <Menu.Item key="4">Option 4</Menu.Item>
                                </MenuItemGroup>
                            </SubMenu>
                            <SubMenu
                                key="sub2"
                                title={
                                    <span>
              <Icon type="appstore" />
              <span>Navigation Two</span>
            </span>
                                }
                            >
                                <Menu.Item key="5">Option 5</Menu.Item>
                                <Menu.Item key="6">Option 6</Menu.Item>
                                <SubMenu key="sub3" title="Submenu">
                                    <Menu.Item key="7">Option 7</Menu.Item>
                                    <Menu.Item key="8">Option 8</Menu.Item>
                                </SubMenu>
                            </SubMenu>
                            <SubMenu
                                key="sub4"
                                title={
                                    <span>
              <Icon type="setting" />
              <span>Navigation Three</span>
            </span>
                                }
                            >
                                <Menu.Item key="9">Option 9</Menu.Item>
                                <Menu.Item key="10">Option 10</Menu.Item>
                                <Menu.Item key="11">Option 11</Menu.Item>
                                <Menu.Item key="12">Option 12</Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    {/*内容区*/}
                    <Content className='home-body-container'>
                        <Switch>
                            {renderRoutes(this.state.route)}
                        </Switch>
                    </Content>
                </Layout>
                <Friends uid={this.state.user.uid}></Friends>
            </Layout>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        pageTitle: state.pageTitle,
        infoList: state.infoList
    }
}

// mapDispatchToProps：将dispatch映射到组件的props中
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        setPageTitle (data) {
            // 如果不懂这里的逻辑可查看前面对redux-thunk的介绍
            dispatch(setPageTitle(data))
            // 执行setPageTitle会返回一个函数
            // 这正是redux-thunk的所用之处:异步action
            // 上行代码相当于
            /*dispatch((dispatch, getState) => {
                dispatch({ type: 'SET_PAGE_TITLE', data: data })
            )*/
        },
        setInfoList (data) {
            dispatch(setInfoList(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)
