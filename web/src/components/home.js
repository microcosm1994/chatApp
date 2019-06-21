import React, { Component } from 'react'
import {Layout, Menu, Icon, Avatar, Dropdown, message, Modal } from 'antd'
import { Switch } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import cookie from 'react-cookies'
import io from 'socket.io-client'
import {$axios} from "../lib/interceptors";
import {connect} from 'react-redux'
import avator from '../img/avator.jpg'
// 引入action
import {setUser, setSocket, setTargetInfo} from '../store/action'
import Friends from './friends'
import ChatWindow from "./chatWindow";
import '../css/home.css'

const { Header, Sider, Content } = Layout
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const confirm = Modal.confirm;
class Home extends Component{
    constructor (props) {
        super(props)
        const {setUser} = props
        this.state = {
            route: props.route.routes,
            isrender: false,
            user: {
                nickname: cookie.load('nickname'),
                uid: cookie.load('uid'),
                token: cookie.load('t')
            }
        }
        setUser(this.state.user)
    }
    componentDidMount () {
        // 创建socket连接
        const socket = io('ws://localhost:7001', {
            reconnectionAttempts: 10,
            query: {
                uid: this.state.user.uid
            }
        })
        this.props.setSocket(socket) // 保存socket实例
        this.recvMessage(socket) // 监听聊天信息
        this.monitorAsk(socket) // 监听视频聊天请求
    }
    // 获取聊天窗口子组件
    onRef (name, ref) {
        switch (name) {
            case 'chatWindow':
                this.chatWindow = ref
                break
            case 'friends':
                this.friends = ref
                break
            default:
                break
        }
    }
    // 销毁聊天窗口组件
    setIsrender (state) {
        this.setState({
            isrender: state
        })
        if (!state) {
            this.chatWindow = null
        }
    }
    // 接收消息
    recvMessage(socket) {
        socket.on('CHAT_RES', res => {
            if (res.status === 200) {
                // 等待组件挂载之后获取到子组件的实例之后，调用子组件的更新视图方法
                if (this.chatWindow) {
                    this.chatWindow.updateView(res.data)
                }
                // 判断friends子组件实例和chatWindow子组件实例，如果chatWindow组件实例不存在，则代表最新消息没有读过，需要更新未读消息数
                if (this.friends && !this.chatWindow) {
                    // 更新子组件未读消息数
                    this.friends.setUnread(res.data.userid)
                    // 提示
                    message.info('您有一条新消息')
                }
            }
        })
    }
    // 监听socket消息
    monitorAsk (socket) {
        const self = this
        const uid = this.props.user.uid
        // 监听socket消息
        socket.on('CHATVIDEO_REQ', res => {
            const {setTargetInfo} = this.props
            if (res.status === 200) {
                $axios.post('/api/user/getuser', {id: res.data.userid}).then(user => {
                    if (user.status === 200) {
                        setTargetInfo(user.data)
                        confirm({
                            title: '请求视频通话',
                            content: user.data.nickname + '请求和您视频通话',
                            onOk() {
                                // 显示子组件
                                self.setIsrender(true)
                                // 开启子组件的视频组件（子组件的子组件）
                                self.openChatVideo(socket)
                                // 等待视频聊天子组件渲染后开始交换ice信息
                                self.onchatVideo(socket, user.data)
                            },
                            onCancel() {
                                // 发送视频请求的应答
                                socket.emit('CHATVIDEO_RES', {
                                    userid: uid, // 用户id
                                    targetid: user.data.id, // 目标用户id
                                    sid: socket.id // socketid
                                }, 'cancel')
                            },
                        })
                    }
                })
            }
        })
    }
    // 开启子组件的视频聊天组件
    openChatVideo () {
        if (this.chatWindow) {
            // 调用子组件的方法
            this.chatWindow.setState({
                isRender: {
                    chatVideo: true
                }
            })
        } else {
            setTimeout(() => {
                this.openChatVideo()
            }, 100)
        }
    }
    startChatVideo () {
        if (this.chatWindow.chatVideo) {
            this.chatWindow.chatVideo.createPeerConnection()
        } else {
            setTimeout(() => {
                this.startChatVideo()
            }, 100)
        }
    }
    onchatVideo (socket, targetInfo) {
        const uid = this.props.user.uid
        if (this.chatWindow && this.chatWindow.chatVideo) {
            socket.emit('CHATVIDEO_RES', {
                userid: uid, // 用户id
                targetid: targetInfo.id, // 目标用户id
                sid: socket.id // socketid
            }, 'ok')
            this.startChatVideo()
        }else {
            setTimeout(() => {
                this.onchatVideo(socket, targetInfo)
            }, 100)
        }
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
        )
        return(
            <Layout className='home'>
                {/*头部*/}
                <Header className='home-header'>
                    <div className='home-header-user'>
                        <div className='home-header-user-avator'>
                            <Avatar shape='square' size={30}  src={avator} />
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
                <Friends
                    destroy={this.setIsrender.bind(this)}
                    history={this.props.history}
                    uid={this.state.user.uid}
                    onRef={this.onRef.bind(this)}
                />
                <div id='chatWindowContainer'>
                    {this.state.isrender ? (
                        <ChatWindow
                            destroy={this.setIsrender.bind(this)}
                            onRef={this.onRef.bind(this)}
                        />
                    ) : null}
                </div>
            </Layout>
        )
    }
}

function mapStateToProps (state, ownProps) {
    return {
        user: state.user
    }
}
function mapDispatchToProps (dispatch, ownProps) {
    return {
        setUser (data) {
            dispatch(setUser(data))
        },
        setSocket (data) {
            dispatch(setSocket(data))
        },
        setTargetInfo (data) {
            dispatch(setTargetInfo(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home)

