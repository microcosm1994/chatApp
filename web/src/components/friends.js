import React, {Component} from 'react'
import {Icon, Avatar, Tabs, Input, List, message } from 'antd'
import {$axios} from "../lib/interceptors";
import '../css/friends.css'

const TabPane = Tabs.TabPane;
const Search = Input.Search;
export default class friends extends Component{
    constructor (props) {
        super(props)
        this.state = {
            uid: props.uid,
            friendsList: [],
            searchFriendsList: []
        }
    }
    componentDidMount () {
        this.getFriends()
    }
    // 切换tab栏
    tabHandler (key) {
        if (key - 0 === 1) {
            this.getFriends()
        }
        if (key - 0 === 2) {
            console.log('群组');
        }
    }
    // 获取好友列表
    getFriends () {
        let form = {
            userId: this.state.uid
        }
        $axios.post('/api/friends/get', form).then((res) => {
            if (res.status === 200) {
                this.setState({friendsList: res.data})
            }
        })
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
                userid: this.state.uid,
                type: 1
            }
            $axios.post('/api/friendsMsg/add', form).then((res) => {
                if (res.status === 200) {
                    message.success('好友请求已发送')
                }
            })
        }
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
                            <Avatar size="small" src='../img/avator.jpg' />
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
                        <Tabs defaultActiveKey="1" onChange={this.tabHandler.bind(this)}>
                            <TabPane tab="用户" key="1">
                                <List
                                    itemLayout="horizontal"
                                    dataSource={this.state.friendsList}
                                    renderItem={item => (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                                title={<a href="https://ant.design">{item.title}</a>}
                                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                            />
                                        </List.Item>
                                    )}
                                />
                            </TabPane>
                            <TabPane tab="聊天组" key="2">
                                Content of Tab Pane 2
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
                                        actions={[<a onClick={this.addFriends.bind(this, item.id)} disabled={item.relation - 0 === 0} state={item.relation}>加好友</a>]}
                                    >
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
