import React, {Component} from 'react'
import {Icon, Avatar, Tabs, Input, List, message, Badge } from 'antd'
import {$axios} from "../lib/interceptors";
import '../css/friends.css'
import {connect} from 'react-redux'
import avator from '../img/avator.jpg'
// 引入action
import {setTargetInfo} from '../store/action'

const TabPane = Tabs.TabPane;
const Search = Input.Search;
class friends extends Component{
    constructor (props) {
        super(props)
        this.state = {
            uid: props.uid,
            unreadChat: false,
            friendsList: [], // 好友列表
            searchFriendsList: [], // 搜索好友列表
            friendsMsgList: [], // 好友消息列表
            notifyList: [], // 通知列表
        }
    }
    componentDidMount () {
        console.log(avator);
        this.getFriends()
        this.props.onRef('friends', this)
    }
    // 切换好友、聊天组tab栏
    tabHandler (key) {
        if (key === '1' || key === '1-1') {
            this.getFriends()
            this.setState({unreadChat: false})
        }
        if (key === '1-2') {
            console.log('群组');
        }
        if (key === '2' || key === '2-1') {
            this.getFriendsMsg()
        }
        if (key === '2-2') {
            console.log('通知');
        }
    }
    // 获取好友列表
    getFriends () {
        let form = {
            uid: this.props.user.uid
        }
        $axios.post('/api/friends/get', form).then((res) => {
            if (res.status === 200) {
                let idArr = []
                for (let i = 0; i < res.data.length; i++) {
                    if (!idArr.includes(res.data[i].targetInfo.id)) {
                        idArr.push(res.data[i].targetInfo.id)
                    }
                }
                this.getUnread(idArr)
                this.setState({friendsList: res.data})
            }
        })
    }
    // 获取未读消息
    getUnread (idArr) {
        $axios.post('/api/msgrecord/getUnread', {userid: idArr}).then((res) => {
            if (res.status === 200) {
                let friendsList = this.state.friendsList
                let count = 0 // 未读消息计数
                if (res.data.length > 0) {
                    this.setState({unreadChat: true})
                }
                for (let i = 0; i < friendsList.length; i++) {
                    for (let k = 0 ; k < res.data.length; k++) {
                        if (friendsList[i].targetInfo.id === res.data[k].userid) {
                            count++
                        }
                    }
                    friendsList[i]['unread'] = count
                    count = 0 // 消息计数归0
                }
                this.setState({friendsList})
            }
        })
    }
    // 设置未读消息
    setUnread (userid) {
        let friendsList = this.state.friendsList
        for (let i = 0; i < friendsList.length; i++) {
            if (friendsList[i].targetInfo.id === userid) {
                friendsList[i]['unread'] += 1
            }
        }
        this.setState({friendsList, unreadChat: true})
    }
    // 搜索用户
    searchFriends (value) {
        if (value) {
            let form = {
                username: value,
                nickname: value,
            }
            $axios.post('/api/user/get', form).then((res) => {
                if (res.status === 200) {
                    this.setState({searchFriendsList: res.data})
                }
            })
        }
    }
    // 发送添加好友请求
    addFriends (id) {
        if (id) {
            let form = {
                targetid: id,
                userid: this.state.uid
            }
            $axios.post('/api/friendsMsg/add', form).then((res) => {
                if (res.status === 200) {
                    message.success('好友请求已发送')
                }
            })
        }
    }
    // 获取好友消息列表
    getFriendsMsg () {
        let form = {
            targetid: this.state.uid,
            opera: 0,
        }
        $axios.post('/api/friendsMsg/getList', form).then((res) => {
            if (res.status === 200) {
                this.setState({friendsMsgList: res.data})
            }
        })
    }
    // 消息操作
    msgOpera (id, opera) {
        let form = {
            where: {
                id: id
            },
            update: {
                opera: opera
            },
        }
        $axios.post('/api/friendsMsg/put', form).then((res) => {
            if (res.status === 200) {
                this.getFriendsMsg()
            }
        })
    }
    // 忽略消息
    msgIgnore (id) {
        let form = {
            where: {
                id: id
            },
            update: {
                delete: 1
            },
        }
        $axios.post('/api/friendsMsg/put', form).then((res) => {
            if (res.status === 200) {
                this.getFriendsMsg()
            }
        })
    }
    // 打开聊天窗口
    openChatWindow (row) {
        const {setTargetInfo} = this.props
        setTargetInfo(row)
        // 清除未读消息
        let friendsList = this.state.friendsList
        let flag = false
        for (let i = 0; i < friendsList.length; i++) {
            // 当前聊天用户的未读消息清零
            if (friendsList[i].targetInfo.id === row.id) {
                friendsList[i]['unread'] = 0
            }
            // 判断如果有一条消息未读，则红点就继续存在
            if (friendsList[i]['unread'] > 1) {
                flag = true
            }
        }
        // 判断如果没有未读消息，则红点就消失
        if (!flag) {
            this.setState({unreadChat: flag})
        }
        this.setState({friendsList})
        // 调用父组件的方法渲染聊天窗口子组件
        this.props.destroy(true)
    }
    // 显示模态框
    modalShow () {
        this.refs.friendsModal.style.display = 'block'
    }
    // 隐藏模态框
    modalHide () {
        this.refs.friendsModal.style.display = 'none'
    }
    // 放大窗口
    smallFullscreen () {
        this.refs.friendsSmallWindow.style.display = 'none'
        this.refs.friendsBigWindow.style.display = 'block'
    }
    // 缩小窗口
    bigFullscreen () {
        this.refs.friendsBigWindow.style.display = 'none'
        this.refs.friendsSmallWindow.style.display = 'block'
    }
    render () {
        return (
            <div className='friends'>
                <div className='friends-smallWindow' ref='friendsSmallWindow'>
                    <div className='friends-smallWindow-info'>
                        <div className='friends-smallWindow-info-avator'>
                            <Avatar size="small" src={avator} />
                        </div>
                        <div className='friends-smallWindow-info-name'>
                            小宇宙
                        </div>
                    </div>
                    <div className='friends-smallWindow-fullscreen' onClick={this.smallFullscreen.bind(this)}>
                        <Icon type="fullscreen" />
                    </div>
                </div>
                <div className='friends-bigWindow' ref='friendsBigWindow'>
                    <div className='friends-bigWindow-info'>
                        <div className='friends-bigWindow-info-menu'>
                            <div className='friends-bigWindow-info-menu-fullscreen' onClick={this.bigFullscreen.bind(this)}>
                                <Icon type="fullscreen-exit" />
                            </div>
                        </div>
                        <div className='friends-bigWindow-info-container'>
                            <div className='friends-bigWindow-info-container-avator'>
                                <Avatar shape='square' size={30}  src='../img/avator.jpg' />
                            </div>
                            <div className='friends-bigWindow-info-container-name'>
                                小宇宙
                            </div>
                        </div>
                    </div>
                    <div className='friends-bigWindow-container'>
                        <Tabs defaultActiveKey="1" type="card" tabPosition='bottom' onChange={this.tabHandler.bind(this)}>
                            <TabPane tab="聊天" key="1">
                                <Tabs size='small' defaultActiveKey="1-1" onChange={this.tabHandler.bind(this)}>
                                    <TabPane tab={<Badge dot={this.state.unreadChat}>好友</Badge>} key="1-1">
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={this.state.friendsList}
                                            renderItem={item => (
                                                <List.Item actions={[
                                                    <ListBtn click={this.openChatWindow.bind(this, item.targetInfo, 1)} text='聊天' self={this} data={item} />]}>
                                                    <List.Item.Meta
                                                        avatar={<Badge count={item.unread}><Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" /></Badge>}
                                                        title={<a href="https://ant.design">{item.targetInfo.nickname}</a>}
                                                        description=""
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </TabPane>
                                    <TabPane tab="聊天组" key="1-2">
                                        Content of Tab Pane 2
                                    </TabPane>
                                </Tabs>
                            </TabPane>
                            <TabPane tab="消息" key="2">
                                <Tabs size='small' defaultActiveKey="2-1"  onChange={this.tabHandler.bind(this)}>
                                    <TabPane tab="好友消息" key="2-1">
                                        <List
                                            itemLayout="horizontal"
                                            dataSource={this.state.friendsMsgList}
                                            renderItem={item => (
                                                <List.Item actions={[
                                                    <ListBtn click={this.msgOpera.bind(this, item.id, 1)} text='同意' self={this} data={item} />,
                                                    <ListBtn click={this.msgOpera.bind(this, item.id, 2)} text='拒绝' self={this} data={item} />,
                                                    <ListBtn click={this.msgIgnore.bind(this, item.id)} text='忽略' self={this} data={item} />]}>
                                                    <List.Item.Meta
                                                        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                        title={<a href="https://ant.design">{item.target.nickname}</a>}
                                                    />
                                                </List.Item>
                                            )}
                                        />
                                    </TabPane>
                                    <TabPane tab="通知" key="2-2">
                                        Content of Tab Pane 2
                                    </TabPane>
                                </Tabs>
                            </TabPane>
                        </Tabs>
                    </div>
                    <div className='friends-bigWindow-modal' ref='friendsModal'>
                        <div className='friends-bigWindow-modal-menu'>
                            <div className='friends-bigWindow-modal-menubtn' onClick={this.modalHide.bind(this)}>
                                <Icon type="minus" />
                            </div>
                        </div>
                        <div className='friends-bigWindow-modal-search'>
                            <Search size='small' placeholder="输入账号或用户昵称" onSearch={this.searchFriends.bind(this)} enterButton />
                        </div>
                        <div className='friends-bigWindow-modal-container'>
                            <List
                                size='small'
                                itemLayout="horizontal"
                                dataSource={this.state.searchFriendsList}
                                renderItem={item => (
                                    <List.Item
                                        actions={[<a onClick={this.addFriends.bind(this, item.id)} >加好友</a>]}>
                                        <List.Item.Meta
                                            avatar={<Avatar shape="square" src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                            title={<a href="https://ant.design">{item.nickname}</a>}
                                            description="sssss"
                                        />
                                    </List.Item>
                                )}
                            />
                        </div>
                    </div>
                    <div className='friends-bigWindow-tool'>
                        {/*{添加按钮}*/}
                        <div className='friends-bigWindow-tool-menu' onClick={this.modalShow.bind(this)}>
                            <Icon type="plus" />
                        </div>
                        {/*{搜索按钮}*/}
                        <div className='friends-bigWindow-tool-menu' onClick={this.modalShow.bind(this)}>
                            <Icon type="search" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
function ListBtn(props) {
    return <a onClick={props.click} disabled={props.data.relation - 0 === 0} state={props.data.relation}>{props.text}</a>
}
function mapStateToProps (state, ownProps) {
    return {
        user: state.user,
        socket: state.socket,
        targetInfo: state.targetInfo,
        chatWindow: state.chatWindow
    }
}
function mapDispatchToProps (dispatch, ownProps) {
    return {
        setTargetInfo (data) {
            dispatch(setTargetInfo(data))
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(friends)
